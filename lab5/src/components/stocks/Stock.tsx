import {Button, Checkbox} from "@mui/material";
import React from "react";

interface StockProps{
    code:string,
    name: string,
    active:boolean,
    detailsClick: Function,
    checkBoxChange:Function
}


export default function Stock(props:StockProps) {

    return (
        <div className="panel flex justify-between p-5" style={{width:"min(600px, 100%)"}}>
        <div className="flex flex-col gap-5" style={{flex:"90%"}}>
            <div className="flex justify-between ">
                <p className="font-bold md:text-xl sm:text-xs">{props.code}</p>
                <p className="md:text-xl sm:text-xs">{props.name}</p>
                <div></div>
            </div>
            <div>
                <Button variant="outlined"  onClick={()=>props.detailsClick(props.code)}>Подробнее</Button>
            </div>
        </div>
        <div className="flex flex-col justify-center">
            <Checkbox checked={props.active} onChange={(event, checked)=>props.checkBoxChange(props.code,checked)}/>
        </div>
    </div>
    )
}