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
import React, {useEffect, useRef, useState} from "react";
import Header from "../header/Header";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/store";
import {setSpeed, setStartDate, setStarted} from "../../app/startSlice";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {fetchStocks, IStock, Price} from "../stocks/Stocks";
import {pushStocks} from "../../app/stocksSlice";

import io from 'socket.io-client';

const socket = io('http://localhost:3100');
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
        <TableContainer component={Paper} sx={{maxHeight:"calc(100vh - 136px)"}}>
        <Table stickyHeader>
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


interface StartTradingDTO {
    startDate:string,
    speed:number,
    stocks:{code: string, active: boolean}[]
}

interface StocksUpdateDTO {
    last:boolean
    open:boolean
    date:string,
    stocks:ITradingStock[]
}


export default function Start() {

    const speed = useSelector((state: RootState) => state.startState.speed)
    const started = useSelector((state: RootState) => state.startState.started)
    const startDate = useSelector((state: RootState) => state.startState.startDate)
    const stocks = useSelector((state: RootState) => state.stocksState.stocksState)
    const stocksFetched = useRef(false)
    const connectingStarted = useRef(false)
    const [currentDate,setCurrentDate] = useState<Date>(new Date(startDate))
    const [tradingStatus,setTradingStatus] = useState("")
    const [tradingStocks,setTradingStocks] = useState<ITradingStock[]>([])
    const dispatch = useDispatch()
    useEffect(()=>{
        if(!connectingStarted.current) {
            connectingStarted.current = true
            socket.on('connect', () => {

                console.log("connected")

                socket.on('disconnect', () => {
                    console.log("disconnected")
                    socket.off("connect")
                    socket.off('disconnect');
                    socket.off('update');
                    connectingStarted.current = false
                });

                socket.on('update', (data:StocksUpdateDTO) => {
                    setCurrentDate(new Date(data.date))
                    if(data.last) setTradingStatus("Торги окончены.")
                    else if(!data.open) setTradingStatus("Торги приостановлены.")
                    else {
                        setTradingStocks(data.stocks)
                        setTradingStatus("Торги идут.")
                    }

                });

                socket.emit('status',(res:string)=>{
                    if(res==='running') {
                        dispatch(setStarted(true))
                    }
                    console.log(res)
                })

            });
            socket.connect()
        }


        if(stocks.length===0 && !stocksFetched.current) {
            stocksFetched.current = true
            fetchStocks((response: IStock[]) => {
                dispatch(pushStocks({stocksState: response}))
                console.log("use effect")
            })
        }
        else {
            stocksFetched.current=true
        }
        return ()=>{
            connectingStarted.current = false
            console.log("disconnected")
            socket.off("connect")
            socket.off('disconnect');
            socket.off('update');
            socket.disconnect()
        }
    },[])



    let startHandler = () => {
        if(!started && stocksFetched.current && !isNaN(+speed) && (+speed)>0 && !isNaN((new Date(startDate)).getTime())) {
            dispatch(setStarted(true));
            socket.emit('start',{startDate:startDate,speed:+speed,stocks: stocks} as StartTradingDTO)
        }
        else {
            socket.emit('stop')
            dispatch(setStarted(false));
        }

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

    let Trading = () => {


        return (
            <div>
                <div className="panel flex justify-between items-center">
                    <span>Текущая дата: {currentDate.toLocaleDateString(undefined,{ year: 'numeric', month: 'long', day: 'numeric',weekday:"short"})}, {tradingStatus}</span>
                    <StartStopButton started={started} onClick={startHandler}/>
                </div>
                <div className="flex justify-center" >
                    <div  style={{width:"min(800px, 100vw)",margin:"0",overflowY:"hidden"}}>
                        <StockTable stocks={tradingStocks} />
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