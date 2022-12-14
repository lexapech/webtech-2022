import { configureStore } from '@reduxjs/toolkit'
import stocksReducer from "./stocksSlice";
import startReducer from "./startSlice";

export const store = configureStore({
    reducer: {
        stocksState: stocksReducer,
        startState: startReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
