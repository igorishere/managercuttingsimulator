import Box from "@mui/material/Box";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ParametersForm from "../ParametersForm/ParametersForm";
import { useEffect, useRef, useState } from "react";
import { TurnManager } from "../../common/cutter/TurnManager";
import { TurnToRectangleConverter } from "../../common/cutter/TurnToRectangleConverter";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { Utils } from "../../common/Utils";
import { setAxisFirstCut, setBoardHeight, setBoardWidth, setDisplacement, setMargin, setPhaseNumber } from "../../redux/slices/cutterslice";
import './SandboxArea.css';
import { DefaultParameters } from "../../common/parameters/DefaultParameters";
import { DefaultTheme } from "../../theme/DefaultTheme";
import createTheme from "@mui/material/styles/createTheme";
import Canvas from "../Canvas/Canvas";
import Rect from "../Canvas/Rect";
import CuttingPlanElement from "./CuttingPlanElements/CuttingPlanElement";
import { ePlacementType } from "./CuttingPlanElements/ePlacementType";
import { eAxis } from "../../common/cutter/eAxis";

let turnManager = new TurnManager();
let turnToRectangleConverter = new TurnToRectangleConverter();
export default function SandboxArea() {

    const { boardWidth, boardHeight, displacement, phaseNumber, axisFirstCut, margin } = useAppSelector(state => state.cutter);
    const dispatcher = useAppDispatch();

    const theme = createTheme(DefaultTheme);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [openSnackBar, setOpenSnackbar] = useState(false);
    const [turnsCount, setTurnsCount] = useState(0);
    const [partsCount, setPartsCount] = useState(0);
    const [cutsCount, setCutsCount] = useState(0);
    const [elementsToDraw, setElementsToDraw] = useState(Array<Rect>);
    const [aspectRatio, setAspectRatio] = useState(0);
    const [startPointCanvas, setStartPointCanvas] = useState({ X: 0, Y: 0 });
    useEffect(() => DefineBoardSize(), [boardWidth, boardHeight]);
    useEffect(() => UpdateStatusBar(), [elementsToDraw]);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cuttingPlanCanvasWrapperReference = useRef<HTMLDivElement>(null);

    function DefineBoardSize(): void {

        var container = cuttingPlanCanvasWrapperReference.current;
        let { clientWidth, clientHeight } = container;

        var boardWithInPixels = Utils.ConvertMilimetersToPixels(boardWidth);
        var boardHeightInPixels = Utils.ConvertMilimetersToPixels(boardHeight);

        var ratioW: number = boardWithInPixels / (clientWidth - 50);
        var ratioH: number = boardHeightInPixels / (clientHeight - 50);

        var maxAspectRatio = Math.max(ratioW, ratioH)
        setAspectRatio(maxAspectRatio);

        var rectWidth = boardWithInPixels / maxAspectRatio;
        var rectHeight = boardHeightInPixels / maxAspectRatio;

        var X = -(rectWidth / 2);
        var Y = -(rectHeight / 2);
        setStartPointCanvas({ X, Y });

        var lineOptions = {
            color: "#000",
            thickness: 1.3
        }
        var parts = new Array<CuttingPlanElement>();
        setElementsToDraw(parts);
        var board = new CuttingPlanElement(ePlacementType.Sheet, rectWidth, rectHeight, X, Y, "#DFF1E6", lineOptions);
        var newElements = [board];
        setElementsToDraw(newElements);
    }

    function UpdateStatusBar(): void {
        setTurnsCount(turnManager.GetUsedTurnsCount() ?? 0);
        setCutsCount(turnManager.GetCutsCount() ?? 0);
        setPartsCount(elementsToDraw.filter(e => (e as CuttingPlanElement).elementType === ePlacementType.Part ?? 0).length);
    }

    function PerformNewCut(): void {

        if (turnManager.turns.length === 0)
            turnManager.Start(boardWidth, boardHeight, axisFirstCut);

        var turn = turnManager.GetTurnByIndex(phaseNumber);

        if (turn === undefined || turn === null) return;

        var { maxAcceptableDisplacement } = turn;
        if (displacement + margin >= maxAcceptableDisplacement) {

            var feedbackMessage = maxAcceptableDisplacement <= 0
                ? "There´s no free space to execute a new command."
                : `Invalid command. The command displacement must be lesser than ${maxAcceptableDisplacement} mm.`;

            setFeedbackMessage(feedbackMessage);
            setOpenSnackbar(true);
            return;
        }

        turn.executeCut(displacement, margin);
        var parts = turnToRectangleConverter.ConvertTurn(turn, margin, aspectRatio, startPointCanvas);
        var newElementsToDraw = FilterParts(parts.concat(elementsToDraw), turn.cutAxis);
        setElementsToDraw(newElementsToDraw);
        UpdateStatusBar();
    }


    function FilterParts(firstArray: Rect[], cutAxis: eAxis) {

        var groups = new Array<Rect[]>;

        firstArray.forEach((element) => {
            var g = groups.findIndex(e => e[0].x === element.x && e[0].y === element.y);

            if (g === -1) {
                groups.push([element]);
            } else {
                groups[g].push(element);
            }
        });

        return groups.map((group, index, array) => group.sort((a, b) => a.width < b.width ? -1 : 1)
            .sort((a, b) => a.height < b.height ? -1 : 1)[0]);
    }

    function ClearCanvas(): void {

        var board = elementsToDraw.filter(rect => (rect as CuttingPlanElement).elementType === ePlacementType.Sheet);

        setElementsToDraw(board);

        turnManager = new TurnManager();

        const {
            DefaultPhaseNumber,
            DefaultDisplacement,
            DefaultBoardWidth,
            DefaultBoardHeight,
            DefaultFirstCutAxis,
            DefaultMargin
        } = DefaultParameters;

        UpdateStatusBar();
        DefineBoardSize();

        dispatcher(setPhaseNumber(DefaultPhaseNumber));
        dispatcher(setDisplacement(DefaultDisplacement));
        dispatcher(setBoardWidth(DefaultBoardWidth));
        dispatcher(setBoardHeight(DefaultBoardHeight));
        dispatcher(setAxisFirstCut(DefaultFirstCutAxis));
        dispatcher(setMargin(DefaultMargin));
    }

    function CloseSnackBar(): void {
        setOpenSnackbar(false);
    }

    return (
        <Box
            sx={{
                bgcolor: '#E7E7E7',
                height: '92%',
                padding: '20px',
            }}>
            <Grid
                container
                spacing={4}
            >
                <Grid item xs={8}>
                    <Paper id='cuttingPlanWrapper'>
                        <Stack id="cuttingPlanStatusBar" direction="row" spacing={1}>
                            <Chip label={`Cuts: ${cutsCount}`} color="primary" />
                            <Chip label={`Turns: ${turnsCount}`} color="primary" />
                            <Chip label={`Parts: ${partsCount}`} color="primary" />
                        </Stack>
                        <div id="cuttingPlanCanvasWrapper" ref={cuttingPlanCanvasWrapperReference}>
                            <Canvas elements={elementsToDraw} />
                        </div>
                    </Paper>
                    <Snackbar
                        open={openSnackBar}
                        autoHideDuration={5000}
                        onClose={(event: React.SyntheticEvent | Event, reason?: string) => {
                            if (reason === 'clickaway') {
                                return;
                            }

                            CloseSnackBar();
                        }}>
                        <Alert
                            onClose={CloseSnackBar}
                            severity="warning">
                            {feedbackMessage}
                        </Alert>
                    </Snackbar>
                </Grid>
                <Grid item xs={4}>
                    <Paper>
                        <ParametersForm
                            performNewCut={PerformNewCut}
                            clearCurrentBoard={ClearCanvas}
                        />
                    </Paper>
                </Grid>
            </Grid>
        </Box>

    );
}  
