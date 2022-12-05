import {Button, TextField} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";


export default function Login() {
    let navigate = useNavigate()
    return (
        <div className="flex justify-center items-center w-full h-full">
            <div className="panel">
                <div className="flex flex-col">
                    <div className="m-5">
                        <TextField style={{width:300}} label="Логин" variant="standard" />
                    </div>
                    <div className="m-5">
                        <TextField type="password" style={{width:300}} label="Пароль" variant="standard" />
                    </div>
                    <div className="m-5 flex justify-center">
                        <Button variant="contained" onClick={()=>navigate("/brokers")}>Войти</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}