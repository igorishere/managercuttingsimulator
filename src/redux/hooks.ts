import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { State,Dispatch } from './store'


export const useAppDispatch: () => Dispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<State> = useSelector