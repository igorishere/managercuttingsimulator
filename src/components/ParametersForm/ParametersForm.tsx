import { List, ListSubheader, ListItem, MenuItem } from "@mui/material";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setBoardWidth, setBoardHeight, setDisplacement, setPhaseNumber, setAxisFirstCut } from '../../redux/slices/cutterslice';
import { eAxis, eAxisStrings } from "../../common/cutter/eAxis";
import { useEffect, useMemo, useState } from "react";
import ParametersFormProps from "./ParametersFormProps";
import { useDispatch } from "react-redux";

const subheader = (<ListSubheader>Parameters</ListSubheader>);

export default function ParametersForm(props: ParametersFormProps) {

    const { boardWidth, boardHeight, displacement, phaseNumber, axisFirstCut } = useAppSelector(state => state.cutter);
    const dispatcher = useAppDispatch();
    const performNewCutAllowed = useMemo(() => {
        return displacement === 0 ||
            displacement === null ||
            displacement === undefined ||
            isNaN(displacement)
    }, [displacement]);
 
   
    const [boardWidthState,setBoardWidthState] = useState(boardWidth.toString());
    const [boardHeightState,setBoardHeightState] = useState(boardHeight.toString());
    const [displacementState,setDisplacementState] = useState(displacement.toString());
    useEffect(() => {
        var valueAsNumber = parseFloat(boardWidthState);

        if(valueAsNumber && (valueAsNumber !== boardWidth)){
            dispatcher(setBoardWidth(valueAsNumber));
        }
    },[boardWidthState]); 
    useEffect(()=>{
        var boardWidthAsString = boardWidth.toString();

        if(boardWidthAsString !== boardWidthState){
            setBoardWidthState(boardWidthAsString);
        }  
    },[boardWidth]);

    useEffect(() => {
        var valueAsNumber = parseFloat(boardHeightState);

        if(valueAsNumber && (valueAsNumber !== boardHeight)){
            dispatcher(setBoardHeight(valueAsNumber));
        }
    },[boardHeightState]); 
    useEffect(()=>{
        var boardHeightAsString = boardHeight.toString();

        if(boardHeightAsString !== boardHeightState){
            setBoardHeightState(boardHeightAsString);
        }  
    },[boardHeight]);

    useEffect(() => {
        var valueAsNumber = parseFloat(displacementState);

        if(valueAsNumber && (valueAsNumber !== displacement)){
            dispatcher(setDisplacement(valueAsNumber));
        }
    },[displacementState]); 
    useEffect(()=>{
        var displacementAsString = displacement.toString();

        if(displacementAsString !== displacementState){
            setDisplacementState(displacementAsString);
        }  
    },[displacement]);

    return (
        <>
            <List subheader={subheader}>
                <ListItem>
                    <TextField
                        sx={{ height: '40px', width: '150px' }}
                        label="Axis first cut"
                        variant="outlined"
                        select
                        size="small"
                        value={axisFirstCut}
                        onChange={(e) => {
                            const value = eAxis[e.target.value as eAxisStrings];
                            dispatcher(setAxisFirstCut(value))
                        }}
                    >
                        {Object.keys(eAxis).map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}

                    </TextField>
                </ListItem>
                <ListItem>
                    <TextField
                        sx={{ height: '40px' }}
                        label="Board width"
                        variant="outlined"
                        size="small"
                        defaultValue={boardWidthState}
                        value={boardWidthState}
                        onChange={(e) => {
                            var {value} = e.target;
                            value = value.replace(",","."); 
                            setBoardWidthState(value);
                        }}
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        sx={{ height: '40px' }}
                        label="Board height"
                        variant="outlined"
                        size="small"
                        defaultValue={boardHeightState}
                        value={boardHeightState}
                        onChange={(e) => {
                            var {value} = e.target;
                            value = value.replace(",","."); 
                            setBoardHeightState(value);
                        }}
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        sx={{ height: '40px' }}
                        label="Displacement"
                        variant="outlined"
                        size="small"
                        defaultValue={displacementState}
                        value={displacementState}
                        onChange={(e) => {
                            var {value} = e.target;
                            value = value.replace(",","."); 
                            setDisplacementState(value);
                        }}
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        sx={{ height: '40px' }}
                        label="Phase number"
                        variant="outlined"
                        size="small"
                        defaultValue={phaseNumber}
                        value={phaseNumber}
                        onChange={(e) => dispatcher(setPhaseNumber(parseInt(e.target.value)))}
                    />
                </ListItem>
                <ListItem>
                    <Stack spacing={2} direction="row">
                        <Button
                            variant="contained"
                            onClick={props.performNewCut}
                            disabled={performNewCutAllowed}>Cut!</Button>
                        <Button
                            variant="contained"
                            onClick={props.clearCurrentBoard}
                        >Clear board</Button>
                    </Stack>
                </ListItem>
            </List>
        </>
    );
}