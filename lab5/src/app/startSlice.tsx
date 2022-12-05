import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface StartState {
    startDate:string,
    speed:string,
    started:boolean
}

const initialState: StartState = {
    startDate:"",
    speed:"0",
    started:false
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
        }
    },
})

// Action creators are generated for each case reducer function
export const { setStartDate,setSpeed,setStarted } = startSlice.actions

export default startSlice.reducer