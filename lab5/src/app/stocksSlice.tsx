import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface StocksState {
    stocksState: {code:string,active:boolean}[]
}

const initialState: StocksState = {
    stocksState: []
}

export const stocksSlice = createSlice({
    name: 'stocksState',
    initialState,
    reducers: {
        pushStocks: (state, stocks: PayloadAction<StocksState>) => {
            state.stocksState.push(...stocks.payload.stocksState.map(x=>{return {code:x.code,active:x.active}}))
        },

        setActivated: (state, action: PayloadAction<{code:string,active:boolean}>) => {
            let stock = state.stocksState.find(x=> x.code === action.payload.code)
            if(stock) {
                stock.active = action.payload.active
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setActivated,pushStocks } = stocksSlice.actions

export default stocksSlice.reducer