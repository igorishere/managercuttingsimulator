import React,{useEffect, useRef, useState} from 'react';  
import './App.css';
import IPosition from '../interfaces/IPosition'; 
import { TurnManager } from '../common/TurnManager';
import Turn from '../common/Turn';
 
let lastDisplacementAxisX: number = 0;
let lastDisplacementAxisY: number = 0;

let turnManager = new TurnManager();

function App() {
 
const [phaseNumber,setPhaseNumber] = useState("");
const [displacement,setDisplacement] = useState("");  
const [axisFirstCut,setAxisFirstCut] = useState("");
const [feedbackMessage,setFeedbackMessage] = useState("");

const canvasRef = useRef<HTMLCanvasElement>(null);

useEffect(()=>{
  let canvas = canvasRef.current;
  var container = document.getElementById('container') as HTMLDivElement;

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  var context = canvas.getContext("2d");
  context.lineCap = 'round';
  context.lineWidth = 3;
   
  setAxisFirstCut("");
  
  lastDisplacementAxisX = canvas.width;
  lastDisplacementAxisY = canvas.height;
  turnManager = new TurnManager();
},[]);

function handleSubmit(params: React.FormEvent<Element>)
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
   drawLine(start,end);
   } 
   
function drawLine( start: IPosition,end: IPosition): void{
  let canvas = canvasRef.current;
  let context = canvas.getContext("2d");
  
  context.moveTo(start.X,start.Y);
  context.lineTo(end.X,end.Y);
  context.stroke(); 
}

  function clearCanvas(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();

    var canvas = canvasRef.current;
    var context = canvas.getContext("2d"); 
    
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();

    lastDisplacementAxisX = canvas.width;
    lastDisplacementAxisY = canvas.height;

    turnManager = new TurnManager();

    setPhaseNumber("");
    setDisplacement("");  
    setAxisFirstCut(""); 
    setFeedbackMessage("");
  }

  function GetInitalAndFinalCoordinates(turn: Turn, displacement: number): [start: IPosition,end: IPosition]{

    var {startPoint,usedDisplacement} = turn;

    var start = {
      X: 0,
      Y: 0
    }
  
    let end = {
      X: 0,
      Y: 0
    }

    if(turn.cutAxis == "x"){
      var positionAxisY = startPoint.Y + usedDisplacement + displacement; 
    
      start.X = startPoint.X;
      start.Y = positionAxisY;
    
      end.X = startPoint.X + turn.width;
      end.Y = positionAxisY;  
      lastDisplacementAxisY = displacement;  
   }
 
   if(turn.cutAxis == "y"){
     var positionAxisX = startPoint.X + usedDisplacement + displacement; 
      
      start.X = positionAxisX;
      start.Y = startPoint.Y;
      
      end.X = positionAxisX;
      end.Y = startPoint.Y + turn.height;
      lastDisplacementAxisX = displacement;
   }

    return [start,end];
  }

  function handleAxisFirstCutChange(value: string): void {
    if(value === "x" || value === "y"){
      setAxisFirstCut(value);
      setPhaseNumber("1");

      turnManager.Start(canvasRef.current.width,canvasRef.current.height,value);
    }
  }

  return (
    <div id='container' className='container'>
    <canvas id='canvas' ref={canvasRef}></canvas>
    <div className='boardFooter'>
    <form onSubmit={(e) => handleSubmit(e)} id="form">
    {
    axisFirstCut === "" || axisFirstCut === undefined ? 
    (
    <>
      <p>Axis first cut:</p>
      <select onChange={(e) => handleAxisFirstCutChange(e.target.value)}>
        <option value="none">none</option>
        <option value="x">Horizontal</option>
        <option value="y">Vertical</option>
      </select>
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
      <button onClick={e => clearCanvas(e)}>Clear board</button>
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
