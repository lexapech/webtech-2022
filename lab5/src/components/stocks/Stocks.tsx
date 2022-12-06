import {
    Dialog,
    DialogTitle, IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableHead,
    TableRow
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import { Line } from "react-chartjs-2";
import Header from "../header/Header";
import Stock from "./Stock";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import CloseIcon from "@mui/icons-material/Close";
import {RootState} from "../../app/store";
import {pushStocks, setActivated} from "../../app/stocksSlice";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {API_ENDPOINT} from "../../App";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface StockDetailsProps {
    code:string|null,
    onClose: ()=>void
}

export function fetchStocks(callback:Function) {
    axios.get(API_ENDPOINT+'stocks/all').then(res=>{
        callback(res.data)
    }).catch(e=>{
        console.log(e)
    })
}

function fetchStockDetails(code:string, callback:Function) {
    axios.get(API_ENDPOINT+'stocks/details?code='+code).then(res=>{
        callback(res.data)
    }).catch(e=>{
        console.log(e)
    })
}

function Chart(props:{code: string,data:StockData[]}) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
    };
    const ChartData = {
        labels: props.data.map(x=>x.date),
        datasets: [{
            label: props.code,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: props.data.map(x=>x.open),
        }]
    }

    return <Line options={options} data={ChartData}/>
}

function StockTable(props:{data:StockData[]}) {
    return (
        <TableContainer component={Paper}>
            <Table stickyHeader >
                <TableHead>
                    <TableRow>
                        <TableCell>Дата</TableCell>
                        <TableCell>Открытие</TableCell>
                        <TableCell>Закрытие</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {props.data.map((row) => (
                        <TableRow
                            key={row.date}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row"><span className="font-semibold">{row.date}</span></TableCell>
                            <TableCell><Price value={row.open}/></TableCell>
                            <TableCell><Price value={row.close}/></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export function Price({value}:{value:number}) {
    return <span className="font-semibold">{value.toLocaleString(undefined,{
        style: 'currency',
        currency: 'USD'
    })}
    </span>
}

function StockDetails(props:StockDetailsProps) {

    const [data,setData] = useState<StockData[]>([])
    useEffect(()=>{
        if(props.code)
            fetchStockDetails(props.code,(response:StockData[])=>{
                setData(response)
            })
    },[props.code])

    return (
        <Dialog maxWidth={false} PaperProps={{ sx:{maxWidth:"min(800px, 100vw)",margin:"0"} }} onClose={props.onClose} open={props.code!==null}>
            <DialogTitle sx={{padding:"15px 5px"}}>
                <div className="flex justify-between items-center">
                    <span>Информация об акции {props.code}</span>
                    <IconButton onClick={props.onClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                </DialogTitle>

            <div style={{width:"min(800px, 100vw",overflowY:"scroll"}}>
                <Chart code={props.code?props.code:""} data={data}/>
                <div >
                    <StockTable data={data}/>
                </div>
            </div>

        </Dialog>
    )
}

interface StockData {
    date:string,
    open:number,
    close:number
}

export interface IStock {
    code:string,
    name:string,
    active:boolean
}



export default function Stocks() {

    const stocksState = useSelector((state: RootState) => state.stocksState.stocksState)
    const stocksFetched = useRef(false)
    const dispatch = useDispatch()
    let [stocks,setStocks] = useState<IStock[]>([])
    useEffect(()=>{
        if(!stocksFetched.current) {
            stocksFetched.current=true
            fetchStocks((response: IStock[]) => {
                setStocks(response)
                if (stocksState.length === 0)
                    dispatch(pushStocks({stocksState: response}))
            })
        }
    },[])

    const [details,setDetails] = useState<null|string>(null)

    let stockClickHandler= (code:string)=>{
        setDetails(code)
    }
    let stockCheckHandler= (code:string,checked:boolean)=>{
        dispatch(setActivated({code: code,active:checked}))
    }

    let active = (code:string) => {
        let state = stocksState.find(x=>x.code===code)
        if(state) {
            return state.active
        }
        return false
    }

    return (
        <div className="flex flex-col">

           <div className="flex justify-center panel mb-5">
                 <Header page="stocks"></Header>
            </div>
            <div
                className="flex flex-col items-center gap-5 overflow-scroll"
                style={{height:"calc(100vh - 68px)",maxHeight:"calc(100vh - 68px)"}}
            >
                {
                    stocks.map((x)=><Stock
                        code={x.code}
                        name={x.name}
                        active={active(x.code)}
                        detailsClick={stockClickHandler}
                        key={x.code}
                        checkBoxChange={stockCheckHandler}
                    ></Stock>)
                }
            </div>
            <StockDetails code={details} onClose={()=>setDetails(null)}/>
        </div>
    )
}