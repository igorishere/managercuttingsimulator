import React,{useEffect, useRef, useState} from 'react';  
import './App.css';
import IPosition from './interfaces/IPosition';
import Turn from './Turn';
 
let lastDisplacementAxisX: number = 0;
let lastDisplacementAxisY: number = 0;

function App() {

const [turns,setTurns] = useState(new Array<Turn>());
const [phaseNumber,setPhaseNumber] = useState("");
const [displacement,setDisplacement] = useState(""); 
const [startPosition,setStartPosition] = useState(null);
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
  
  setStartPosition({X: 0,Y:0});
  setAxisFirstCut("");
  
  lastDisplacementAxisX = canvas.width;
  lastDisplacementAxisY = canvas.height;
},[]);

function handleSubmit(params: React.FormEvent<Element>)
{ 
  params.preventDefault();

   let canvas = canvasRef.current;
   let context = canvas.getContext("2d");
   let choosedDisplacement = parseInt(displacement);
   let choosedPhaseNumber = parseInt(phaseNumber);
   setFeedbackMessage("");

   var turn = managePhases(choosedPhaseNumber);

   if(turn === undefined || turn === null) return;

   var start = {
    X: 0,
    Y: 0
  }

  let end = {
    X: 0,
    Y: 0
  }

  var {startPoint,usedDisplacement, maxAcceptableDisplacement} = turn;

  if(choosedDisplacement > maxAcceptableDisplacement){

     var feedbackMessage = maxAcceptableDisplacement <= 0 
     ? "There´s no free space to execute a new command."
     : `Invalid command. The command displacement must be lesser than ${maxAcceptableDisplacement}`;
    

    setFeedbackMessage(feedbackMessage);
    return;
  }

   if(turn.cutAxis == "x"){
     var positionAxisY = startPoint.Y + usedDisplacement + choosedDisplacement; 
   
     start.X = startPoint.X;
     start.Y = positionAxisY;
   
     end.X = startPoint.X + turn.width;
     end.Y = positionAxisY;  
     lastDisplacementAxisY = choosedDisplacement;  
  }

  if(turn.cutAxis == "y"){
    // var {startPoint,usedDisplacement,maxAcceptableDisplacement} = turn;
    var positionAxisX = startPoint.X + usedDisplacement + choosedDisplacement; 
     
     start.X = positionAxisX;
     start.Y = startPoint.Y;
     
     end.X = positionAxisX;
     end.Y = startPoint.Y + turn.height;
     lastDisplacementAxisX = choosedDisplacement;
  }

   turn.updateUsedDisplacement(choosedDisplacement);
   drawLine(context,start,end);
   } 
   
function drawLine(context: CanvasRenderingContext2D, start: IPosition,end: IPosition): void{
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

    setPhaseNumber("");
    setDisplacement(""); 
    setStartPosition({X:0,Y:0});
    setAxisFirstCut("");
    setTurns(new Array<Turn>());
    lastDisplacementAxisX = canvas.width;
    lastDisplacementAxisY = canvas.height;
    setFeedbackMessage("");
  }

  function handleAxisFirstCutChange(value: string): void {
    if(value === "x" || value === "y"){
      setAxisFirstCut(value);

      var maxAcceptableDisplacement, width,height = null;  

      if(value === "y"){
        maxAcceptableDisplacement = canvasRef.current.width;
        width = canvasRef.current.width;
        height = canvasRef.current.height;
      }else{
        maxAcceptableDisplacement = canvasRef.current.height;
        width = canvasRef.current.width;
        height = canvasRef.current.height;
      }

      var turn = new Turn(1,maxAcceptableDisplacement,startPosition,value,width,height);
      var newturns = turns;
      newturns.push(turn);
      setTurns(newturns);
      setPhaseNumber("1");
    }
  }
  function managePhases(phaseNumber: number): Turn {
  
    var currentPhase = getCurrentPhaseWithIndex(phaseNumber);
    var previousPhase = getCurrentPhaseWithIndex(phaseNumber-1);

    if(currentPhase) return currentPhase;

    if(previousPhase){
      
      var startPoint = null;
      var maxAcceptableDisplacement = 0,width,height;

      if(previousPhase.cutAxis == "x"){
        var positionY = previousPhase.usedDisplacement - lastDisplacementAxisY;

       positionY =  positionY >= 0 ? positionY : 0;

        startPoint ={
          X: previousPhase.startPoint.X,
          Y: positionY
        };

        maxAcceptableDisplacement = lastDisplacementAxisX;
        width = lastDisplacementAxisX;
        height = lastDisplacementAxisY;
      }else{
        
        var positionX = previousPhase.usedDisplacement - lastDisplacementAxisX;

        positionX = positionX >= 0 ? positionX : 0; 

        startPoint ={
          X: positionX,
          Y: previousPhase.startPoint.Y
        };

        maxAcceptableDisplacement = lastDisplacementAxisY;
        width = lastDisplacementAxisX;
        height = lastDisplacementAxisY;
      }

      currentPhase = new Turn(phaseNumber,maxAcceptableDisplacement,startPoint,oppositeAxis(previousPhase.cutAxis),width,height);

      var currentTurns = turns;
      currentTurns.push(currentPhase);
      setTurns(currentTurns); 
    }

    return currentPhase;
  }
  const getCurrentPhaseWithIndex = (choosedPhase: number): Turn => turns.filter( x => x.index == choosedPhase )[0];

  const oppositeAxis = (axis:string ): string => axis === "x" ? "y" : "x";

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
    <p>Displacement:</p>
    <input type="number" name='displacement' value={displacement} onChange={(e) => setDisplacement(e.target.value)}></input>

    <p>Phase:</p>
    <input type="text" name='phase' value={phaseNumber} onChange={(e) => setPhaseNumber(e.target.value)}></input>

    <button type='submit'>Send</button>

    {
    axisFirstCut === "" || axisFirstCut === undefined ? 
    (
    <> 
    </>
    ) : 
    (
    <button onClick={e => clearCanvas(e)}>Clear board</button>
    )

    } 
    </form>
    <p id="feedbackMessage">{feedbackMessage}</p>
    </div>
    </div>
  );
}

export default App; 
