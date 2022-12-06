import {Avatar, IconButton, TextField} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from "@mui/icons-material/Close";
import React, {useState} from "react";

export interface IBroker {
    name:string,
    funds:number
}
export interface BrokerProps {
    broker: IBroker,
    onFundsChange: Function
    onRemove:Function
}

export default function Broker(props: BrokerProps) {

    const [funds,setFunds] = useState(props.broker.funds.toString())
    const [valid,setValid] = useState(true)

    let onFundsChange = (e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setFunds(e.currentTarget.value)

        if(isNaN(+e.currentTarget.value)) {
            setValid(false)
            return
        }
        props.onFundsChange(props.broker.name,+e.currentTarget.value)
        setValid(true)
    }

    return (
        <div className="panel flex justify-between" style={{width:"min(600px, 100%)"}}>
            <div className="flex gap-5 p-4">
                <div className="flex flex-col justify-center">
                    <Avatar sx={{ bgcolor: "gray" }} variant="circular">
                        <AccountCircleIcon />
                    </Avatar>
                </div>
                <div className="flex flex-col">
                    <p className="text-xl font-bold">{props.broker.name}</p>
                    <TextField
                        error={!valid}
                        type="number"
                        value={funds}
                        onChange={onFundsChange}
                        style={{width:100}}
                        label="Средства"
                        variant="standard"
                        size="small"
                    />
                </div>
            </div>
            <div className="flex flex-col justify-center pr-5">
                <IconButton onClick={()=>props.onRemove(props.broker.name)} aria-label="delete">
                    <CloseIcon />
                </IconButton>
            </div>

        </div>
    )
}