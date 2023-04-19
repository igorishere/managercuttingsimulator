import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './slices/counterSlice'
import cutterslice from './slices/cutterslice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cutter: cutterslice
  },
}); 

export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch