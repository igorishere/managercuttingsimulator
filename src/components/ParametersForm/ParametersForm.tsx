import { List, ListSubheader, ListItem, MenuItem } from "@mui/material";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setBoardWidth, setBoardHeight, setDisplacement, setPhaseNumber, setAxisFirstCut } from '../../redux/slices/cutterslice';
import { eAxis, eAxisStrings } from "../../common/cutter/eAxis";
import { useMemo } from "react";
import ParametersFormProps from "./ParametersFormProps";

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
                        defaultValue={boardWidth}
                        value={boardWidth}
                        onChange={(e) => dispatcher(setBoardWidth(parseInt(e.target.value)))}
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        sx={{ height: '40px' }}
                        label="Board height"
                        variant="outlined"
                        size="small"
                        defaultValue={boardHeight}
                        value={boardHeight}
                        onChange={(e) => dispatcher(setBoardHeight(parseInt(e.target.value)))}
                    />
                </ListItem>
                <ListItem>
                    <TextField
                        sx={{ height: '40px' }}
                        label="Displacement"
                        variant="outlined"
                        size="small"
                        defaultValue={displacement}
                        value={displacement}
                        onChange={(e) => dispatcher(setDisplacement(parseInt(e.target.value)))}
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