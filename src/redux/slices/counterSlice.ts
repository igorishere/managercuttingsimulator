import { PayloadAction, createSlice } from '@reduxjs/toolkit' 
import { State } from '../store'

interface CounterState{
  value: number
}

const initialState: CounterState = {
  value: 0
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => { 
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      var {payload} = action;

      if(payload > 0){
        state.value += payload;
      }
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export const selectCount = (state: State) => state.counter.value
export default counterSlice.reducer