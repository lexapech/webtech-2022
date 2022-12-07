import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ITradingStock{
    code:string,
    name:string,
    price:number,
    change:number
}


export interface StartState {
    startDate:string,
    speed:string,
    started:boolean
    currentDate:Date,
    tradingState:string,
    tradingStocks:ITradingStock[]
}

const initialState: StartState = {
    startDate:"",
    speed:"1",
    started:false,
    currentDate:new Date(0),
    tradingState:"",
    tradingStocks:[]
}

export const startSlice = createSlice({
    name: 'startState',
    initialState,
    reducers: {
        setStartDate: (state, action: PayloadAction<string>) => {
            state.startDate = action.payload
        },
        setSpeed: (state, action: PayloadAction<string>) => {
            state.speed = action.payload
        },
        setStarted: (state, action: PayloadAction<boolean>) => {
            state.started = action.payload
        },
        setCurrentDate: (state, action: PayloadAction<Date>) => {
            state.currentDate = action.payload
        },
        setTradingState: (state, action: PayloadAction<string>) => {
            state.tradingState = action.payload
        },
        setTradingStocks: (state, action: PayloadAction<ITradingStock[]>) => {
            state.tradingStocks = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setStartDate,setSpeed,setStarted,setCurrentDate,setTradingState,setTradingStocks } = startSlice.actions

export default startSlice.reducer