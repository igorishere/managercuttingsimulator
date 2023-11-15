import { List, ListSubheader, ListItem, MenuItem, ButtonGroup, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setBoardWidth, setBoardHeight, setDisplacement, setPhaseNumber, setAxisFirstCut, setMargin } from '../../redux/slices/cutterslice';
import { eAxis, eAxisStrings } from "../../common/cutter/eAxis";
import { useEffect, useMemo, useState } from "react";
import ParametersFormProps from "./ParametersFormProps";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";


export default function ParametersForm(props: ParametersFormProps) {

    const { boardWidth, boardHeight, displacement, phaseNumber, axisFirstCut, margin } = useAppSelector(state => state.cutter);
    const dispatcher = useAppDispatch();
    const performNewCutAllowed = useMemo(() => {
        return displacement === 0 ||
            displacement === null ||
            displacement === undefined ||
            isNaN(displacement)
    }, [displacement]);


    const [boardWidthState, setBoardWidthState] = useState(boardWidth.toString());
    const [boardHeightState, setBoardHeightState] = useState(boardHeight.toString());
    const [displacementState, setDisplacementState] = useState(displacement.toString());
    const [marginState, setMarginState] = useState(margin.toString());
    useEffect(() => {
        var valueAsNumber = parseFloat(boardWidthState);

        if (valueAsNumber && (valueAsNumber !== boardWidth)) {
            dispatcher(setBoardWidth(valueAsNumber));
        }
    }, [boardWidthState]);
    useEffect(() => {
        var boardWidthAsString = boardWidth.toString();

        if (boardWidthAsString !== boardWidthState) {
            setBoardWidthState(boardWidthAsString);
        }
    }, [boardWidth]);

    useEffect(() => {
        var valueAsNumber = parseFloat(boardHeightState);

        if (valueAsNumber && (valueAsNumber !== boardHeight)) {
            dispatcher(setBoardHeight(valueAsNumber));
        }
    }, [boardHeightState]);
    useEffect(() => {
        var boardHeightAsString = boardHeight.toString();

        if (boardHeightAsString !== boardHeightState) {
            setBoardHeightState(boardHeightAsString);
        }
    }, [boardHeight]);

    useEffect(() => {
        var valueAsNumber = parseFloat(displacementState);

        if (valueAsNumber && (valueAsNumber !== displacement)) {
            dispatcher(setDisplacement(valueAsNumber));
        }
    }, [displacementState]);
    useEffect(() => {
        var displacementAsString = displacement.toString();

        if (displacementAsString !== displacementState) {
            setDisplacementState(displacementAsString);
        }
    }, [displacement]);

    useEffect(() => {
        var valueAsNumber = parseFloat(marginState);

        if (valueAsNumber && (valueAsNumber !== margin)) {
            dispatcher(setMargin(valueAsNumber));
        }
    }, [marginState]);
    useEffect(() => {
        var marginAsString = margin.toString();

        if (marginAsString !== marginState) {
            setMarginState(marginAsString);
        }
    }, [margin]);


    function FormatValueBeforeSetState(value: string, setValue: (value: string) => void) {
        value = value.replace(",", ".");
        setValue(value);
    }

    const subheader = (
        <ListSubheader color="primary">
            <Typography variant='subtitle1'>Parameters</Typography>
        </ListSubheader>);

    return (
        <>
            <List subheader={subheader} style={{paddingTop:'20px'}} > 
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
                        onChange={(e) => FormatValueBeforeSetState(e.target.value, setBoardWidthState)}
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
                        onChange={(e) => FormatValueBeforeSetState(e.target.value, setBoardHeightState)}
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        sx={{ height: '40px' }}
                        label="Tool thickness"
                        variant="outlined"
                        size="small"
                        defaultValue={marginState}
                        value={marginState}
                        onChange={(e) => FormatValueBeforeSetState(e.target.value, setMarginState)}
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
                        onChange={(e) => FormatValueBeforeSetState(e.target.value, setDisplacementState)}
                    />
                </ListItem>
                <ListItem style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start'
                }}>
                    <Typography fontSize={12} marginLeft={3} color={'#666'}>
                        Phase number
                    </Typography>
                    <ButtonGroup>
                        <Button onClick={(e) => dispatcher(setPhaseNumber(phaseNumber - 1))}>
                            <RemoveIcon fontSize="small" />
                        </Button>
                        <Typography
                            style={{
                                width: '50px',
                                border: '0.5px solid #0E8388',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                            {phaseNumber}
                        </Typography>
                        <Button onClick={(e) => dispatcher(setPhaseNumber(phaseNumber + 1))}>
                            <AddIcon fontSize="small" />
                        </Button>
                    </ButtonGroup>
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