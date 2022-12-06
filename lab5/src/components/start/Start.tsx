import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import React, {useEffect, useRef} from "react";
import Header from "../header/Header";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {setSpeed, setStartDate, setStarted} from "../../app/startSlice";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {fetchStocks, IStock, Price} from "../stocks/Stocks";
import {pushStocks} from "../../app/stocksSlice";
function StartStopButton({started,onClick}:{started:boolean,onClick: React.MouseEventHandler<HTMLButtonElement>}) {
    if (started) {
        return <Button variant="contained" color="error" onClick={onClick}>СТОП</Button>
    } else {
        return <Button variant="contained" color="success" onClick={onClick}>СТАРТ</Button>
    }
}

interface ITradingStock{
    code:string,
    name:string,
    price:number,
    change:number
}

function Change({value}:{value:number}) {
    let string = value.toLocaleString(undefined,{
        style: 'currency',
        currency: 'USD'
    })
    if (value > 0) {
        return <span className="font-semibold" style={{color:"#11d200"}}>{string}<ArrowDropUpIcon/></span>
    }
    else if (value < 0) {
        return <span className="font-semibold" style={{color:"red"}}>{string}<ArrowDropDownIcon/></span>
    }
    else {
        return <span className="font-semibold" style={{color:"black"}}>{string}</span>
    }
}

function StockTable(props:{stocks:ITradingStock[]}) {
    return (
        <TableContainer component={Paper}>
        <Table stickyHeader >
            <TableHead>
                <TableRow>
                    <TableCell>Инструмент</TableCell>
                    <TableCell align="center">Цена</TableCell>
                    <TableCell align="center">Изменение</TableCell>
                </TableRow>
            </TableHead>
            <TableBody >
                {props.stocks.map((row) => (
                    <TableRow
                        key={row.code}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            <p className="font-semibold" style={{fontSize:"13px"}}>{row.code}</p>
                            <p style={{fontSize:"12px"}}>{row.name}</p>
                        </TableCell>
                        <TableCell align="center"><Price value={row.price}/></TableCell>
                        <TableCell align="center"><Change value={row.change}/></TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    )
}

function getData() {
    let data:ITradingStock[]=[]
    data.push({code:"DICK",name:"DICK Corporation",price:999.0,change:100})
    data.push({code:"COCK",name:"COCK Company",price:201.0,change:-1.0})
    data.push({code:"COCKS",name:"COCK Company",price:201.0,change:-1.0})
    return data
}


export default function Start() {

    const speed = useSelector((state: RootState) => state.startState.speed)
    const started = useSelector((state: RootState) => state.startState.started)
    const startDate = useSelector((state: RootState) => state.startState.startDate)
    const stocks = useSelector((state: RootState) => state.stocksState.stocksState)
    const stocksFetched = useRef(false)


    const dispatch = useDispatch()
    useEffect(()=>{
        if(stocks.length===0 && !stocksFetched.current) {
            stocksFetched.current = true
            fetchStocks((response: IStock[]) => {
                dispatch(pushStocks({stocksState: response}))
                console.log("use effect")
            })
        }
    },[])
    let startHandler = () => {
        if(!started) {
            console.log(stocks.filter(stock=>stock.active))
        }
        dispatch(setStarted( !started));
    }

    let speedChangeHandler = (event: React.ChangeEvent<HTMLInputElement>)=>{
        dispatch(setSpeed(event.currentTarget.value))

    }

    let startDateChangeHandler = (event: React.ChangeEvent<HTMLInputElement>)=>{
        dispatch(setStartDate(event.currentTarget.value))
    }

    let Setup = () => {
        return (
            <div className="flex justify-center items-center h-full" >
                <div className="panel flex flex-col gap-5 items-center p-10" style={{width:"min(400px, 100%)"}}>
                    <p className="font-semibold">ДАТА НАЧАЛА ТОРГОВ</p>
                    <div className="m-5">
                        <TextField style={{width:200}} value={startDate} onChange={startDateChangeHandler} type="date" variant="standard" />
                    </div>
                    <p className="font-semibold">СКОРОСТЬ СМЕНЫ ДАТ В СЕКУНДАХ</p>
                    <div className="m-5">
                        <TextField style={{width:200}} type="number" value={speed} onChange={speedChangeHandler} variant="standard" />
                    </div>
                    <div className="m-5 flex justify-center">
                        <StartStopButton started={started}  onClick={startHandler}/>
                    </div>
                </div>
            </div>
        )
    }
    let currentDate =(new Date).toLocaleDateString()
    let Trading = () => {
        return (
            <div>
                <div className="panel flex justify-between items-center">
                    <span>Текущая дата: {currentDate}</span>
                    <StartStopButton started={started} onClick={startHandler}/>
                </div>
                <div className="flex justify-center" >
                    <div  style={{width:"min(800px, 100vw)",margin:"0"}}>
                        <StockTable stocks={getData()}/>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center panel" >
                <Header page="start"></Header>
            </div>
            {!started&&<Setup/>}
            {started&&<Trading/>}
        </div>
    )
}