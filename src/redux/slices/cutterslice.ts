import { PayloadAction, createSlice } from '@reduxjs/toolkit' 
import { eAxis } from '../../common/eAxis';

interface CutterState{
    boardWidth: number,
    boardHeight: number,
    displacement: number,
    phaseNumber: number,
    axisFirstCut: eAxis
}

const DEFAULT_BOARD_WIDTH_IN_MILIMETERS = 2750;
const DEFAULT_BOARD_HEIGHT_IN_MILIMETERS = 1850;

const cutterState: CutterState = {
    boardWidth: DEFAULT_BOARD_WIDTH_IN_MILIMETERS,
    boardHeight: DEFAULT_BOARD_HEIGHT_IN_MILIMETERS,
    displacement: 0,
    phaseNumber: 1,
    axisFirstCut: eAxis.Horizontal
}


const ValidateParameters = (parameter: number): number =>{
    
    if (parameter === null ||
        parameter === undefined ||
        isNaN(parameter) ||
        parameter < 0  ) 
    {
        return 0;
    }

    return parameter;
}

export const cutterSlice = createSlice({
    name: 'cutter',
    initialState: cutterState,
    reducers:{
        setBoardWidth: (state, action: PayloadAction<number>) => {
            const parameter = ValidateParameters(action.payload);
            state.boardWidth = parameter;
        },
        setBoardHeight: (state, action: PayloadAction<number>) => {
            const parameter = ValidateParameters(action.payload);
            state.boardHeight = parameter;
        },
        setDisplacement: (state, action: PayloadAction<number>) => {

            const parameter = ValidateParameters(action.payload);
            state.displacement = parameter;
        },
        setPhaseNumber: (state, action: PayloadAction<number>) => {

            const parameter = ValidateParameters(action.payload);
            state.phaseNumber = parameter;
        },
        setAxisFirstCut: (state, action: PayloadAction<eAxis>) => {
            state.axisFirstCut = action.payload;
        },
    }
});

export const {setBoardWidth,setBoardHeight,setDisplacement,setPhaseNumber,setAxisFirstCut} = cutterSlice.actions;
export default cutterSlice.reducer;