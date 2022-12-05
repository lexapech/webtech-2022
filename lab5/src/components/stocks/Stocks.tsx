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
import React, {useEffect, useState} from "react";
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

function getData():StockData[] {
    const labels = ['10/6/2021', '10/7/2021', '10/8/2021',
        '10/11/2021', '10/12/2021', '10/13/2021', '10/14/2021',
        '10/15/2021', '10/18/2021', '10/19/2021', '10/20/2021',
        '10/21/2021', '10/22/2021', '10/25/2021', '10/26/2021',
        '10/27/2021', '10/28/2021', '10/29/2021', '11/1/2021',
        '11/2/2021', '11/3/2021', '11/4/2021', '11/5/2021' ];
    const values = [139.47, 143.06, 144.03, 142.27, 143.23,
        141.24, 142.11, 143.77, 143.45, 147.01, 148.7, 148.81, 149.69,
        148.68, 149.33, 149.36, 149.82, 147.22, 148.99, 148.66, 150.39,
        151.58, 151.89]
    return labels.map((date,i)=>{
        return {date:date,open:values[i],close:values[i]}
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
        <TableContainer component={Paper} sx={{overflowY:"scroll",maxHeight:"50vh"}}>
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

            <div style={{width:"min(800px, 100vw",overflow:"hidden"}}>
                <Chart code={props.code?props.code:""} data={getData()}/>
                <div >
                    <StockTable data={getData()}/>
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

interface IStock {
    code:string,
    name:string,
    active:boolean
}

function getStocks() {
    let res:IStock[] = []
    res.push({code:"TSLA",name:"Tesla",active:true})
    res.push({code:"DICK",name:"Dick Corporation",active:false})
    return res
}



export default function Stocks() {

    const stocksState = useSelector((state: RootState) => state.stocksState.stocksState)
    const dispatch = useDispatch()
    let [stocks,setStocks] = useState<IStock[]>([])
    useEffect(()=>{
        let temp = getStocks()

        setStocks(temp)
        if(stocksState.length===0)
            dispatch(pushStocks({stocksState:temp}))
        console.log("use effect")
    },[])

    const [details,setDetails] = useState<null|string>(null)

    let stockClickHandler= (code:string)=>{

        setDetails(code)
        console.log(code)
    }
    let stockCheckHandler= (code:string,checked:boolean)=>{
        dispatch(setActivated({code: code,active:checked}))
        console.log(code,checked)
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