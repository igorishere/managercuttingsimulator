import Box from "@mui/material/Box";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import BoardsList from "../BoardsList/BoardsList";
import ParametersForm from "../ParametersForm/ParametersForm";  
import { useEffect, useRef, useState } from "react";
import { TurnManager } from "../../common/TurnManager";
import { useAppSelector,useAppDispatch } from "../../redux/hooks";
import { eAxis,eAxisStrings } from "../../common/eAxis";
import { Utils } from "../../common/Utils";
import Turn from "../../common/Turn";
import IPosition from "../../interfaces/IPosition";
import { setAxisFirstCut, setBoardHeight, setBoardWidth, setDisplacement, setPhaseNumber } from "../../redux/slices/cutterslice";
import Button from "@mui/material/Button";

let lastDisplacementAxisX: number = 0;
let lastDisplacementAxisY: number = 0;
let aspectRatio = 0;

let turnManager = new TurnManager();
export default function SandboxArea(){ 
     
const {boardWidth,boardHeight,displacement,phaseNumber,axisFirstCut}  = useAppSelector( state => state.cutter);
const dispatcher = useAppDispatch();
    
useEffect(()=> DefineBoardSize(),[boardWidth,boardHeight]);
const [feedbackMessage,setFeedbackMessage] = useState("");
const [openSnackBar,setOpenSnackbar] = useState(false);

const canvasRef = useRef<HTMLCanvasElement>(null);

function DefineBoardSize(): void{
    let canvas = canvasRef.current;
    var container = document.getElementById('canvasWrapper') as HTMLDivElement;
  
    let {clientWidth, clientHeight} = container; 
    
    var boardWithInPixels =  Utils.ConvertMilimetersToPixels(boardWidth);
    var boardHeightInPixels =  Utils.ConvertMilimetersToPixels(boardHeight);
  
    var ratioW: number =  boardWithInPixels / (clientWidth - 50);
    var ratioH: number = boardHeightInPixels / (clientHeight - 50);
  
    aspectRatio = Math.max(ratioW,ratioH); 
  
    canvas.width = boardWithInPixels / aspectRatio;
    canvas.height = boardHeightInPixels / aspectRatio;
}
 
function PerformNewCut(): void{

    if(turnManager.turns.length === 0)
    {
        turnManager.Start(boardWidth,boardHeight,axisFirstCut);
    }
    
    var turn = turnManager.GetTurnByIndex(phaseNumber, lastDisplacementAxisY,lastDisplacementAxisX);

    if(turn === undefined || turn === null) return;

    var {maxAcceptableDisplacement} = turn;
    if(displacement >= maxAcceptableDisplacement){

        var feedbackMessage = maxAcceptableDisplacement <= 0 
        ? "There´s no free space to execute a new command."
        : `Invalid command. The command displacement must be lesser than ${maxAcceptableDisplacement} mm.`;
       
       setFeedbackMessage(feedbackMessage);
       setOpenSnackbar(true);
       return;
     }

     var result = GetInitalAndFinalCoordinates(turn,displacement);
     var start = result[0];
     var end = result[1];
   
     turn.updateUsedDisplacement(displacement);
     DrawLine(start,end);
}

function ClearCanvas(): void {
    var canvas = canvasRef.current;
    var context = canvas.getContext("2d"); 
    
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();

    lastDisplacementAxisX = canvas.width;
    lastDisplacementAxisY = canvas.height;

    turnManager = new TurnManager();
    dispatcher(setPhaseNumber(1));
    dispatcher(setDisplacement(0));
    dispatcher(setBoardWidth(2750)); //TODO: Move default sizes to a upper level
    dispatcher(setBoardHeight(1850));
    dispatcher(setAxisFirstCut());
  }

function DrawLine( start: IPosition,end: IPosition): void{
    let canvas = canvasRef.current;
    let context = canvas.getContext("2d");
    
    context.moveTo(start.X,start.Y);
    context.lineTo(end.X,end.Y);
    context.stroke(); 
  }

function GetInitalAndFinalCoordinates(turn: Turn, displacement: number): [start: IPosition,end: IPosition]{
    var {startPoint,usedDisplacement,cutAxis} = turn;

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
 
    
    if(cutAxis === eAxis.Horizontal){
      startPointYInPixels = startPointYInPixels + usedDisplacementInPixels + displacementInPixels; 
    
      start.X = startPointXInPixels;
      start.Y = startPointYInPixels;
    
      end.X = startPointXInPixels + (Utils.ConvertMilimetersToPixels(turn.width) / aspectRatio);
      end.Y = startPointYInPixels;  

      lastDisplacementAxisY = Utils.ConvertPixelsToMilimeters(displacementInPixels) * aspectRatio;  
   }
 
   if(cutAxis === eAxis.Vertical){
     startPointXInPixels = startPointXInPixels + usedDisplacementInPixels + displacementInPixels; 
      
      start.X = startPointXInPixels;
      start.Y = startPointYInPixels;
      
      end.X = startPointXInPixels;
      end.Y = startPointYInPixels + (Utils.ConvertMilimetersToPixels(turn.height) / aspectRatio);
      lastDisplacementAxisX = Utils.ConvertPixelsToMilimeters(displacementInPixels) * aspectRatio;
   }

    return [start,end];
  }

    return(
    <>    
       <Box sx={{flexGrow: 1, bgcolor:'#e2e2e2', padding:'20px 10px'}}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <Paper id='canvasWrapper' sx={{height:'550px', padding:'10px 10px'}}> 
                        <canvas
                        id='canvas'
                        ref={canvasRef}
                        style={{
                            width:'100%',
                            height:'100%', 
                            border: "1px solid #929292",
                            borderRadius: '5px'
                        }}
                        >
                        </canvas>
                    </Paper> 
                </Grid>
                <Grid item xs={4}>
                   <Grid spacing={2} container  direction={'column'}>
                        <Grid item flexGrow={1}>
                            <Paper> 
                                <ParametersForm 
                                    performNewCut={PerformNewCut}
                                    clearCurrentBoard={ClearCanvas}/>
                            </Paper>
                        </Grid>
                        <Grid item flexGrow={1}>
                            <Paper
                                sx={{
                                    height: '340px'
                                }}
                            >
                                <BoardsList />
                            </Paper>
                        </Grid>
                   </Grid>
                </Grid>
            </Grid>
        </Box>  
    </>
    );
} 
