import React,{useEffect, useRef, useState} from 'react';  
import './App.css';
import IPosition from '../interfaces/IPosition'; 
import { TurnManager } from '../common/TurnManager';
import Turn from '../common/Turn';
import { Utils } from '../common/Utils';
import { eAxis } from '../common/eAxis';

let lastDisplacementAxisX: number = 0;
let lastDisplacementAxisY: number = 0;

const DEFAULT_BOARD_WIDTH_IN_MILIMETERS = 2750;
const DEFAULT_BOARD_HEIGHT_IN_MILIMETERS = 1850;

let aspectRatio = 0;

let turnManager = new TurnManager();

function App() {
 
const [phaseNumber,setPhaseNumber] = useState("");
const [displacement,setDisplacement] = useState("");  
const [axisFirstCut,setAxisFirstCut] = useState("");
const [feedbackMessage,setFeedbackMessage] = useState("");
const [boardWidth,setBoardWidth] = useState(DEFAULT_BOARD_WIDTH_IN_MILIMETERS);
const [boardHeight,setBoardHeight] = useState(DEFAULT_BOARD_HEIGHT_IN_MILIMETERS);

const canvasRef = useRef<HTMLCanvasElement>(null);
 
useEffect(()=> DefineBoardSize(),[boardWidth,boardHeight]);
useEffect(()=> StartCanvas(),[]);

function DefineBoardSize(): void{
  let canvas = canvasRef.current;
  var container = document.getElementById('container') as HTMLDivElement;

  let {clientWidth, clientHeight} = container; 
  
  var boardWithInPixels =  Utils.ConvertMilimetersToPixels(boardWidth);
  var boardHeightInPixels =  Utils.ConvertMilimetersToPixels(boardHeight);

  var ratioW: number =  boardWithInPixels / (clientWidth - 50);
  var ratioH: number = boardHeightInPixels / (clientHeight - 50);

  aspectRatio = Math.max(ratioW,ratioH); 

  canvas.width = boardWithInPixels / aspectRatio;
  canvas.height = boardHeightInPixels / aspectRatio;
}

function StartCanvas(){
  let canvas = canvasRef.current; 

  var context = canvas.getContext("2d");
  context.lineCap = 'round';
  context.lineWidth = 3;
   
  setAxisFirstCut("");
  
  lastDisplacementAxisX = Utils.ConvertPixelsToMilimeters(canvas.width * aspectRatio);
  lastDisplacementAxisY = Utils.ConvertPixelsToMilimeters(canvas.height * aspectRatio);
  turnManager = new TurnManager(); 
}

function HandleSubmit(params: React.FormEvent<Element>)
{ 
   params.preventDefault();

   let choosedDisplacement = parseInt(displacement);
   let choosedPhaseNumber = parseInt(phaseNumber);
   setFeedbackMessage("");

  var turn = turnManager.GetTurnByIndex(choosedPhaseNumber, lastDisplacementAxisY,lastDisplacementAxisX);

  if(turn === undefined || turn === null) return;

  var {maxAcceptableDisplacement} = turn;

  if(choosedDisplacement >= maxAcceptableDisplacement){

     var feedbackMessage = maxAcceptableDisplacement <= 0 
     ? "There´s no free space to execute a new command."
     : `Invalid command. The command displacement must be lesser than ${maxAcceptableDisplacement}`;
    
    setFeedbackMessage(feedbackMessage);
    return;
  }

   var result = GetInitalAndFinalCoordinates(turn,choosedDisplacement);
   var start = result[0];
   var end = result[1];
 
   turn.updateUsedDisplacement(choosedDisplacement);
   DrawLine(start,end);
   } 
   
function DrawLine( start: IPosition,end: IPosition): void{
  let canvas = canvasRef.current;
  let context = canvas.getContext("2d");
  
  context.moveTo(start.X,start.Y);
  context.lineTo(end.X,end.Y);
  context.stroke(); 
}

  function ClearCanvas(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();

    var canvas = canvasRef.current;
    var context = canvas.getContext("2d"); 
    
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();

    lastDisplacementAxisX = canvas.width;
    lastDisplacementAxisY = canvas.height;

    turnManager = new TurnManager();
    setBoardHeight(DEFAULT_BOARD_HEIGHT_IN_MILIMETERS);
    setBoardWidth(DEFAULT_BOARD_WIDTH_IN_MILIMETERS);
    setPhaseNumber("");
    setDisplacement("");  
    setAxisFirstCut(""); 
    setFeedbackMessage("");
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

    if(cutAxis == eAxis.Horizontal){
      startPointYInPixels = startPointYInPixels + usedDisplacementInPixels + displacementInPixels; 
    
      start.X = startPointXInPixels;
      start.Y = startPointYInPixels;
    
      end.X = startPointXInPixels + (Utils.ConvertMilimetersToPixels(turn.width) / aspectRatio);
      end.Y = startPointYInPixels;  

      lastDisplacementAxisY = Utils.ConvertPixelsToMilimeters(displacementInPixels) * aspectRatio;  
   }
 
   if(cutAxis == eAxis.Vertical){
     startPointXInPixels = startPointXInPixels + usedDisplacementInPixels + displacementInPixels; 
      
      start.X = startPointXInPixels;
      start.Y = startPointYInPixels;
      
      end.X = startPointXInPixels;
      end.Y = startPointYInPixels + (Utils.ConvertMilimetersToPixels(turn.height) / aspectRatio);
      lastDisplacementAxisX = Utils.ConvertPixelsToMilimeters(displacementInPixels) * aspectRatio;
   }

    return [start,end];
  }

  function handleAxisFirstCutChange(value: eAxis): void {
    if(value !== null || value !== undefined){
      // setAxisFirstCut(value);
      setPhaseNumber("1");

      turnManager.Start(boardWidth,boardHeight,value);
    }
  }

  return (
    <div id='container' className='container'>
    <div id='canvasWrapper'>
      <canvas id='canvas' ref={canvasRef}></canvas>
    </div>
    <div className='boardFooter'>
    <form onSubmit={(e) => HandleSubmit(e)} id="form">
    {
    axisFirstCut === "" || axisFirstCut === undefined ? 
    (
    <>
      <p>Axis first cut:</p>
      <select>
        <option value="none">none</option>
        <option value="x">Horizontal</option>
        <option value="y">Vertical</option>
      </select>

      <p>Board witdth:</p>
      <input type='number' value={boardWidth}  onChange={(e) => setBoardWidth(parseInt(e.target.value))}/>
      <p>Board height:</p>
      <input type='number' value={boardHeight} onChange={(e) => setBoardHeight(parseInt(e.target.value))}/>
    </>
    ) : (<></>)

    }

    {
    axisFirstCut === "" || axisFirstCut === undefined ? 
    (
    <> 
    </>
    ) : 
    (
      <>
    <p>Displacement:</p>
    <input type="number" name='displacement' value={displacement} onChange={(e) => setDisplacement(e.target.value)}></input>

      <p>Phase:</p>
      <input type="text" name='phase' value={phaseNumber} onChange={(e) => setPhaseNumber(e.target.value)}></input>
  
      <button type='submit'>Send</button>
      <button onClick={e => ClearCanvas(e)}>Clear board</button>
      </>
    )

    } 
    </form>
    <p id="feedbackMessage">{feedbackMessage}</p>
    </div>
    </div>
  );
}

export default App; 
