import {Tab, Tabs} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

interface HeaderProps {
    page: "brokers" | "stocks" | "start";
}

export default function Header(props:HeaderProps) {
    let initVal=0


    let navigate = useNavigate()
    let pages=['/brokers','/stocks','/start']
    switch (props.page) {
        case "brokers": initVal=0
            break
        case "stocks": initVal=1
            break
        case "start": initVal=2
            break
    }
    const [value, setValue] = React.useState(initVal);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        navigate(pages[newValue])
    };
    return(
        <Tabs value={value} onChange={handleChange}>
            <Tab label="БРОКЕРЫ" />
            <Tab label="АКЦИИ"  />
            <Tab label="ТОРГИ"  />
        </Tabs>
    )
}