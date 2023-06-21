import Box from "@mui/material/Box";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ParametersForm from "../ParametersForm/ParametersForm";
import { useEffect, useMemo, useRef, useState } from "react";
import { TurnManager } from "../../common/cutter/TurnManager";
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { eAxis } from "../../common/cutter/eAxis";
import { Utils } from "../../common/Utils";
import Turn from "../../common/cutter/Turn";
import IPosition from "../../common/IPosition";
import { setAxisFirstCut, setBoardHeight, setBoardWidth, setDisplacement, setPhaseNumber } from "../../redux/slices/cutterslice";
import './SandboxArea.css';
import { DefaultParameters } from "../../common/parameters/DefaultParameters";
import { DefaultTheme } from "../../theme/DefaultTheme";
import createTheme from "@mui/material/styles/createTheme";

let lastDisplacementAxisX: number = 0;
let lastDisplacementAxisY: number = 0;
let aspectRatio = 0;

let turnManager = new TurnManager();
export default function SandboxArea() {

    const { boardWidth, boardHeight, displacement, phaseNumber, axisFirstCut } = useAppSelector(state => state.cutter);
    const dispatcher = useAppDispatch();

    const theme = createTheme(DefaultTheme);
    useEffect(() => DefineBoardSize(), [boardWidth, boardHeight]);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [openSnackBar, setOpenSnackbar] = useState(false);
    const [turnsCount, setTurnsCount] = useState(0);
    const [cutsCount, setCutsCount] = useState(0);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    function DefineBoardSize(): void {
        let canvas = canvasRef.current;
        var container = document.getElementById('canvasWrapper') as HTMLDivElement;

        let { clientWidth, clientHeight } = container;

        var boardWithInPixels = Utils.ConvertMilimetersToPixels(boardWidth);
        var boardHeightInPixels = Utils.ConvertMilimetersToPixels(boardHeight);

        var ratioW: number = boardWithInPixels / (clientWidth - 50);
        var ratioH: number = boardHeightInPixels / (clientHeight - 50);

        aspectRatio = Math.max(ratioW, ratioH);

        canvas.width = boardWithInPixels / aspectRatio;
        canvas.height = boardHeightInPixels / aspectRatio;
    }

    function UpdateStatusBar(): void {
        setTurnsCount(turnManager.GetUsedTurnsCount() ?? 0);
        setCutsCount(turnManager.GetCutsCount() ?? 0);
    }

    function PerformNewCut(): void {

        if (turnManager.turns.length === 0) {
            turnManager.Start(boardWidth, boardHeight, axisFirstCut);
        }

        var turn = turnManager.GetTurnByIndex(phaseNumber, lastDisplacementAxisY, lastDisplacementAxisX);

        if (turn === undefined || turn === null) return;

        var { maxAcceptableDisplacement } = turn;
        if (displacement >= maxAcceptableDisplacement) {

            var feedbackMessage = maxAcceptableDisplacement <= 0
                ? "There´s no free space to execute a new command."
                : `Invalid command. The command displacement must be lesser than ${maxAcceptableDisplacement} mm.`;

            setFeedbackMessage(feedbackMessage);
            setOpenSnackbar(true);
            return;
        }

        var result = GetInitalAndFinalCoordinates(turn, displacement);
        var start = result[0];
        var end = result[1];

        turn.executeCut(displacement);
        DrawLine(start, end);
        UpdateStatusBar();
    }

    function ClearCanvas(): void {
        var canvas = canvasRef.current;
        var context = canvas.getContext("2d");

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.beginPath();

        lastDisplacementAxisX = canvas.width;
        lastDisplacementAxisY = canvas.height;

        turnManager = new TurnManager();

        const {
            DefaultPhaseNumber,
            DefaultDisplacement,
            DefaultBoardWidth,
            DefaultBoardHeight,
            DefaultFirstCutAxis
        } = DefaultParameters;

        UpdateStatusBar();

        dispatcher(setPhaseNumber(DefaultPhaseNumber));
        dispatcher(setDisplacement(DefaultDisplacement));
        dispatcher(setBoardWidth(DefaultBoardWidth));
        dispatcher(setBoardHeight(DefaultBoardHeight));
        dispatcher(setAxisFirstCut(DefaultFirstCutAxis));
    }

    function DrawLine(start: IPosition, end: IPosition): void {
        let canvas = canvasRef.current;
        let context = canvas.getContext("2d");

        context.moveTo(start.X, start.Y);
        context.lineTo(end.X, end.Y);
        context.stroke();
    }

    function GetInitalAndFinalCoordinates(turn: Turn, displacement: number): [start: IPosition, end: IPosition] {
        var { startPoint, usedDisplacement, cutAxis } = turn;

        let usedDisplacementInPixels = Utils.ConvertMilimetersToPixels(usedDisplacement) / aspectRatio;
        let displacementInPixels = Utils.ConvertMilimetersToPixels(displacement) / aspectRatio;
        var startPointYInPixels = Utils.ConvertMilimetersToPixels(startPoint.Y) / aspectRatio;
        var startPointXInPixels = Utils.ConvertMilimetersToPixels(startPoint.X) / aspectRatio;

        let start = {
            X: 0,
            Y: 0
        }

        let end = {
            X: 0,
            Y: 0
        }


        if (cutAxis === eAxis.Horizontal) {
            startPointYInPixels = startPointYInPixels + usedDisplacementInPixels + displacementInPixels;

            start.X = startPointXInPixels;
            start.Y = startPointYInPixels;

            end.X = startPointXInPixels + (Utils.ConvertMilimetersToPixels(turn.width) / aspectRatio);
            end.Y = startPointYInPixels;

            lastDisplacementAxisY = Utils.ConvertPixelsToMilimeters(displacementInPixels) * aspectRatio;
        }

        if (cutAxis === eAxis.Vertical) {
            startPointXInPixels = startPointXInPixels + usedDisplacementInPixels + displacementInPixels;

            start.X = startPointXInPixels;
            start.Y = startPointYInPixels;

            end.X = startPointXInPixels;
            end.Y = startPointYInPixels + (Utils.ConvertMilimetersToPixels(turn.height) / aspectRatio);
            lastDisplacementAxisX = Utils.ConvertPixelsToMilimeters(displacementInPixels) * aspectRatio;
        }

        return [start, end];
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
                height={'100%'}>
                <Grid item xs={8}>
                    <Paper id='cuttingPlanWrapper'>
                        <Stack id="cuttingPlanStatusBar" direction="row" spacing={1}>
                            <Chip label={`Cuts: ${cutsCount}`} color="primary" />
                            <Chip label={`Turns: ${turnsCount}`} color="primary" />
                            <Chip label="Parts: 9" color="primary" />
                        </Stack>
                        <div id="canvasWrapper">
                            <canvas id='canvas' ref={canvasRef}></canvas>
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
