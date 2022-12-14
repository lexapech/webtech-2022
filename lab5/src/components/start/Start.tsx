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
import {
    setCurrentDate,
    setSpeed,
    setStartDate,
    setStarted,
    setTradingState,
    setTradingStocks
} from "../../app/startSlice";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {fetchStocks, IStock, Price} from "../stocks/Stocks";
import {pushStocks} from "../../app/stocksSlice";

import io from 'socket.io-client';
import axios from "axios";
import {API_ENDPOINT} from "../../AppSettings";

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

interface SetupProps{
    startDate:string,
    speed:string,
    started:boolean
    startDateChangeHandler: React.ChangeEventHandler<HTMLTextAreaElement>,
    speedChangeHandler:React.ChangeEventHandler<HTMLTextAreaElement>,
    startHandler: React.MouseEventHandler<HTMLButtonElement>
    dateRange:{min:Date,max:Date}
}


let Setup = (props:SetupProps) => {
    return (
        <div className="flex justify-center items-center h-full" >
            <div className="panel flex flex-col gap-5 items-center p-10" style={{width:"min(400px, 100%)"}}>
                <p className="font-semibold">ДАТА НАЧАЛА ТОРГОВ</p>
                <span>Доступный диапазон дат:</span>
                <span>{props.dateRange.min.toLocaleDateString()+" - "+props.dateRange.max.toLocaleDateString()}</span>
                <div className="m-5">
                    <TextField style={{width:200}} value={props.startDate} onChange={props.startDateChangeHandler} type="date" variant="standard" />
                </div>
                <p className="font-semibold">СКОРОСТЬ СМЕНЫ ДАТ В СЕКУНДАХ</p>
                <div className="m-5">
                    <TextField style={{width:200}} type="number" value={props.speed} onChange={props.speedChangeHandler} variant="standard" />
                </div>
                <div className="m-5 flex justify-center">
                    <StartStopButton started={props.started}  onClick={props.startHandler}/>
                </div>
            </div>
        </div>
    )
}

interface TradingProps {
    currentDate:Date,
    started:boolean,
    startHandler:React.MouseEventHandler<HTMLButtonElement>
    tradingStocks:ITradingStock[],
    tradingStatus:string
}



let Trading = (props: TradingProps) => {

    return (
        <div>
            <div className="panel flex justify-between items-center">
                <span>Текущая дата: {props.currentDate.toLocaleDateString(undefined,{ year: 'numeric', month: 'long', day: 'numeric',weekday:"short"})}, {props.tradingStatus}</span>
                <StartStopButton started={props.started} onClick={props.startHandler}/>
            </div>
            <div className="flex justify-center" >
                <div  style={{width:"min(800px, 100vw)",margin:"0",overflowY:"hidden"}}>
                    <StockTable stocks={props.tradingStocks} />
                </div>
            </div>
        </div>
    )
}

function fetchDateRange(callback:Function) {
    axios.get<{min:Date,max:Date}>(API_ENDPOINT+'stocks/dates').then(res=>{
        callback(res.data)
    }).catch(e=>{
        console.log(e)
    })
}



export default function Start() {

    const speed = useSelector((state: RootState) => state.startState.speed)
    const started = useSelector((state: RootState) => state.startState.started)
    const startDate = useSelector((state: RootState) => state.startState.startDate)
    const stocks = useSelector((state: RootState) => state.stocksState.stocksState)
    const currentDate = useSelector((state: RootState) => state.startState.currentDate)
    const tradingStatus = useSelector((state: RootState) => state.startState.tradingState)
    const tradingStocks = useSelector((state: RootState) => state.startState.tradingStocks)
    const [dateRange,setDateRange] = useState<{min:Date,max:Date}>({min: new Date(0), max: new Date(0)})

    const stocksFetched = useRef(false)
    const connectingStarted = useRef(false)

    const dispatch = useDispatch()
    useEffect(()=>{

        fetchDateRange((dates:{min:Date,max:Date})=>{

            setDateRange({min:new Date(dates.min),max:new Date(dates.max)})
        })

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
                    dispatch(setCurrentDate(new Date(data.date)))
                    if(data.last) dispatch(setTradingState("Торги окончены."))
                    else if(!data.open) dispatch(setTradingState("Торги приостановлены."))
                    else {
                        dispatch(setTradingStocks(data.stocks))
                        dispatch(setTradingState("Торги идут."))
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
        if(!started &&
            stocksFetched.current &&
            !isNaN(+speed) &&
            (+speed)>0 &&
            !isNaN((new Date(startDate)).getTime()) &&
            new Date(startDate)>=dateRange.min &&
            new Date(startDate)<=dateRange.max) {

            dispatch(setStarted(true));
            socket.emit('start',{startDate:startDate,speed:+speed,stocks: stocks} as StartTradingDTO)
        }
        else {
            socket.emit('stop')
            dispatch(setStarted(false));
        }

    }

    let speedChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>)=>{
        dispatch(setSpeed(event.currentTarget.value))

    }

    let startDateChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>)=>{
        dispatch(setStartDate(event.currentTarget.value))
        //setStartDate(event.currentTarget.value)
    }





    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-center panel" >
                <Header page="start"></Header>
            </div>
            {!started&&<Setup
                dateRange={dateRange}
                started={started}
                startDate={startDate}
                speed={speed}
                startHandler={startHandler}
                speedChangeHandler={speedChangeHandler}
                startDateChangeHandler={startDateChangeHandler}
            />}
            {started&&<Trading
                started={started}
                tradingStatus={tradingStatus}
                startHandler={startHandler}
                tradingStocks={tradingStocks}
                currentDate={currentDate}/>}
        </div>
    )

}