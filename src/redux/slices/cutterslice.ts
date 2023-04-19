import { PayloadAction, createSlice } from '@reduxjs/toolkit' 
import { eAxis } from '../../common/eAxis';

interface CutterState{
    boardWidth: number,
    boardHeight: number,
    displacement: number,
    phaseNumber: number,
    axisFirstCut: eAxis | null
}

const DEFAULT_BOARD_WIDTH_IN_MILIMETERS = 2750;
const DEFAULT_BOARD_HEIGHT_IN_MILIMETERS = 1850;

const cutterState: CutterState = {
    boardWidth: DEFAULT_BOARD_WIDTH_IN_MILIMETERS,
    boardHeight: DEFAULT_BOARD_HEIGHT_IN_MILIMETERS,
    displacement: 0,
    phaseNumber: 1,
    axisFirstCut: null
}

export const cutterSlice = createSlice({
    name: 'cutter',
    initialState: cutterState,
    reducers:{
        setBoardWidth: (state, action: PayloadAction<number>) => {
            state.boardWidth = action.payload;
        },
        setBoardHeight: (state, action: PayloadAction<number>) => {
            state.boardHeight = action.payload;
        },
        setDisplacement: (state, action: PayloadAction<number>) => {
            state.displacement = action.payload;
        },
        setPhaseNumber: (state, action: PayloadAction<number>) => {
            state.phaseNumber = action.payload;
        },
        setAxisFirstCut: (state, action: PayloadAction<eAxis>) => {
            state.axisFirstCut = action.payload;
        },
    }
});

export const {setBoardWidth,setBoardHeight,setDisplacement,setPhaseNumber,setAxisFirstCut} = cutterSlice.actions;
export default cutterSlice.reducer;