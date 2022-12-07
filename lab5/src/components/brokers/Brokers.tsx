import {Button, Dialog, DialogTitle, Fab, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React, {useEffect, useState} from "react";
import {IBroker} from "./Broker";
import Broker from "./Broker";
import Header from "../header/Header";
import axios from "axios";
import {API_ENDPOINT} from "../../AppSettings";

function fetchBrokers(callback:Function) {
    axios.get<{data:IBroker[]}>(API_ENDPOINT+'brokers/all').then(res=>{
        callback(res.data)
    }).catch(e=>{
        console.log(e)
    })
}

function postBroker(newBroker:IBroker) {
    axios.post(API_ENDPOINT+'brokers/new',{...newBroker}).catch(e=>{
        console.log(e)
    })
}

function updateBroker(broker:string,funds:number) {
    axios.post(API_ENDPOINT+'brokers/update',{name:broker,funds: funds}).catch(e=>{
        console.log(e)
    })
}

function deleteBroker(broker:string) {
    axios.post(API_ENDPOINT+'brokers/delete',{name:broker}).catch(e=>{
        console.log(e)
    })
}

function AddBroker(props: {open:boolean, onClose: Function  }) {

    const [name,setName]=useState("")
    const [funds,setFunds]=useState("")

    let NameChangeHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setName(e.currentTarget.value)
    }
    let FundsChangeHandler = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setFunds(e.currentTarget.value)
    }
    let SaveHandler = ()=>{
        props.onClose({name:name,funds:funds})
    }
    let CloseHandler = ()=>{
        props.onClose(null)
    }

    return (
        <Dialog onClose={CloseHandler} open={props.open}>
            <DialogTitle>Добавление нового брокера</DialogTitle>
            <div className="m-5 flex justify-center">
                <TextField
                    value={name}
                    style={{width:200}}
                    onChange={NameChangeHandler}
                    label="Имя брокера"
                    variant="standard"
                />
            </div>
            <div className="m-5 flex justify-center">
                <TextField
                    value={funds}
                    onChange={FundsChangeHandler}
                    style={{width:200}}
                    label="Средства"
                    variant="standard"
                    size="small"
                />
            </div>
            <div className="m-5 flex justify-center">
                <Button variant="contained" onClick={SaveHandler}>Добавить</Button>
            </div>
        </Dialog>
    )
}


export default function Brokers() {

    const [brokers,setBrokers] = useState<IBroker[]>([])
    useEffect(()=>{
        fetchBrokers(((brokers:IBroker[])=>setBrokers(brokers)))
    },[])


    const [openAddBroker,setOpenAddBroker] = useState(false)

    let brokerFundsChangeHandler = (name:string,funds:number)=> {

        let newBrokers = brokers.map(broker=>{
            if(broker.name===name) broker.funds = funds
            return broker
        })
        setBrokers(newBrokers)
    }

    let openDialog = () => {
        setOpenAddBroker(true)
    }

    let updateBrokersFunds = (name:string,funds:number)=>{
        updateBroker(name,funds)
    }


    let removeBroker = (name: string)=>{
        let newBrokers = brokers.filter(broker=>broker.name!==name)
        deleteBroker(name)
        setBrokers(newBrokers)
    }

    let addBroker = (broker:IBroker|null)=>{
        setOpenAddBroker(false)
        if(broker) {
            let newBrokers=[...brokers,broker]
            postBroker(broker)
            setBrokers(newBrokers)
        }
    }

    return (
        <div className="flex flex-col">
            <div className="flex justify-center panel">
                <Header page="brokers"></Header>
            </div>
            <div
                className="flex flex-col items-center gap-5 overflow-scroll"
                style={{height:"calc(100vh - 68px)",maxHeight:"calc(100vh - 68px)"}}
            >
                <div className="pt-5">
                    <Fab color="primary" onClick={openDialog}  aria-label="add">
                        <AddIcon />
                    </Fab>
                </div>
                {
                    brokers.map((broker,index)=><Broker key={index} onFundsBlur={updateBrokersFunds} broker={broker} onRemove={removeBroker} onFundsChange={brokerFundsChangeHandler}></Broker>)
                }
            </div>
            <AddBroker open={openAddBroker} onClose={addBroker}/>
        </div>

    )
}