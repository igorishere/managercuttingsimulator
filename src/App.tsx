import React,{useEffect, useRef, useState} from 'react';  
import './App.css';
import Command from './Command';
import IPosition from './interfaces/IPosition';
import Turn from './Turn';
 
function App() {

const [turns,setTurns] = useState(new Array<Turn>());
const [phaseNumber,setPhaseNumber] = useState("");
const [displacement,setDisplacement] = useState(""); 
const [startPosition,setStartPosition] = useState(null);
const [lastCommand,setlastCommand] = useState(new Command());
const [axisFirstCut,setAxisFirstCut] = useState("");

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
},[]);

function handleSubmit(params: React.FormEvent<Element>)
{ 
  params.preventDefault();

   let canvas = canvasRef.current;
   let context = canvas.getContext("2d");
   let finalDisplacement = parseInt(displacement);
   let choosedPhase = parseInt(phaseNumber);

   var turn = getCurrentPhaseWithIndex(choosedPhase);

   if(turn === undefined || turn === null) return;

   var start = {
    X: 0,
    Y: 0
  }

  let end = {
    X: 0,
    Y: 0
  }

   if(turn.axis == "x"){
    var {startPoint,usedDisplacement} = turn;
    var positionAxisX = startPoint.X + usedDisplacement + finalDisplacement; 
     
     start.X = positionAxisX;
     start.Y = startPoint.Y;
     
     end.X = positionAxisX;
     end.Y = canvas.height;

     turn.updateUsedDisplacement(finalDisplacement);
    }

   if(turn.axis == "y")
  {
    var {startPoint,usedDisplacement} = turn;
    var positionAxisY = startPoint.Y + usedDisplacement + finalDisplacement; 

    start.X = startPoint.X;
    start.Y = positionAxisY;

    end.X = canvas.width;
    end.Y = positionAxisY;  

    turn.updateUsedDisplacement(finalDisplacement);
  }

  let newStartPosition = {
    X: 0,
    Y: 0
  }
    
   setStartPosition(newStartPosition); 
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
  }

  function handleAxisFirstCutChange(value: string): void {
    if(value === "x" || value === "y"){
      setAxisFirstCut(value);

      var maxAcceptableDisplacement = value === "x" ? canvasRef.current.width : canvasRef.current.height;
      var turn = new Turn(1,maxAcceptableDisplacement,startPosition,value);
      var newturns = turns;
      newturns.push(turn);
      setTurns(newturns);
      setPhaseNumber("1");
    }
  }

  const getCurrentPhaseWithIndex = (choosedPhase: number): Turn => turns.filter( x => x.index == choosedPhase )[0];

  return (
    <div id='container' className='container'>
    <canvas id='canvas' ref={canvasRef}></canvas>
    <form onSubmit={(e) => handleSubmit(e)}>

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
    </form>
    <button onClick={e => clearCanvas(e)}>Clear board</button>
    </div>
  );
}

export default App; 
