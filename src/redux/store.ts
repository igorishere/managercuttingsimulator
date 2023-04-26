import { configureStore } from '@reduxjs/toolkit' 
import cutterslice from './slices/cutterslice';

export const store = configureStore({
  reducer: { 
    cutter: cutterslice
  },
}); 

export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch