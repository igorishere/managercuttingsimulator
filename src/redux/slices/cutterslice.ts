import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { eAxis } from '../../common/cutter/eAxis';
import { DefaultParameters } from '../../common/parameters/DefaultParameters';

interface CutterState {
    boardWidth: number,
    boardHeight: number,
    displacement: number,
    phaseNumber: number,
    margin: number,
    axisFirstCut: eAxis
}


const cutterState: CutterState = {
    boardWidth: DefaultParameters.DefaultBoardWidth,
    boardHeight: DefaultParameters.DefaultBoardHeight,
    displacement: DefaultParameters.DefaultDisplacement,
    phaseNumber: DefaultParameters.DefaultPhaseNumber,
    axisFirstCut: DefaultParameters.DefaultFirstCutAxis,
    margin: DefaultParameters.DefaultMargin
}


const ValidateParameters = (parameter: number): number => {

    if (parameter === null ||
        parameter === undefined ||
        isNaN(parameter) ||
        parameter < 0) {
        return 0;
    }

    return parameter;
}

export const cutterSlice = createSlice({
    name: 'cutter',
    initialState: cutterState,
    reducers: {
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
        setMargin: (state, action: PayloadAction<number>) => {
            const parameter = ValidateParameters(action.payload);
            state.margin = parameter;
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

export const { setBoardWidth, setBoardHeight, setDisplacement, setPhaseNumber, setAxisFirstCut, setMargin } = cutterSlice.actions;
export default cutterSlice.reducer;