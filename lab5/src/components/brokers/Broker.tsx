import {Avatar, IconButton, TextField} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

export interface IBroker {
    name:string,
    funds:number
}
export interface BrokerProps {
    broker: IBroker,
    onFundsChange: Function
    onRemove:Function
}

export default function Broker({broker,onFundsChange,onRemove}: BrokerProps) {
    return (
        <div className="panel flex justify-between" style={{width:"min(600px, 100%)"}}>
            <div className="flex gap-5 p-4">
                <div className="flex flex-col justify-center">
                    <Avatar sx={{ bgcolor: "gray" }} variant="circular">
                        <AccountCircleIcon />
                    </Avatar>
                </div>
                <div className="flex flex-col">
                    <p className="text-xl font-bold">{broker.name}</p>
                    <TextField
                        value={broker.funds}
                        onChange={(e)=>onFundsChange(broker.name,e.currentTarget.value)}
                        style={{width:100}}
                        label="Средства"
                        variant="standard"
                        size="small"
                    />
                </div>
            </div>
            <div className="flex flex-col justify-center pr-5">
                <IconButton onClick={()=>onRemove(broker.name)} aria-label="delete">
                    <CloseIcon />
                </IconButton>
            </div>

        </div>
    )
}