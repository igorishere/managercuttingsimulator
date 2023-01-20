import React,{useEffect, useRef, useState} from 'react';  
import './App.css';
import Command from './Command';
import IPosition from './interfaces/IPosition';
 
function App() {

const [axis,setAxis] = useState("");
const [displacement,setDisplacement] = useState(""); 
const [startPosition,setStartPosition] = useState(null);
const [lastCommand,setlastCommand] = useState(new Command());

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
},[]);

function handleSubmit(params: React.FormEvent<Element>)
{ 
  params.preventDefault();

   let canvas = canvasRef.current;
   let context = canvas.getContext("2d");
   let displ = parseInt(displacement); 

   var start = {
    X: 0,
    Y: 0
  }

  let end = {
    X: 0,
    Y: 0
  }

  let newStartPosition = {
    X: 0,
    Y: 0
  }

    if(axis !== "x" && axis !== "y") return;

    if (axis === "x"){
      displ = startPosition.X + displ; 
      
      start.X = displ;
      start.Y = startPosition.Y;

      end.X = displ;
      end.Y = canvas.height;

      newStartPosition.X = displ;
      newStartPosition.Y = startPosition.Y; 
    } 

    if (axis === "y"){  
      displ = startPosition.Y + displ; 

      start.X = startPosition.X;
      start.Y = displ;

      end.X = canvas.width;
      end.Y = displ;

      newStartPosition.X = startPosition.X;
      newStartPosition.Y = displ; 
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

    setAxis("");
    setDisplacement(""); 
    setStartPosition({X:0,Y:0});
  }

  return (
    <div id='container' className='container'>
    <canvas id='canvas' ref={canvasRef}></canvas>
    <form onSubmit={(e) => handleSubmit(e)}>
      <p>Displacement:</p>
      <input type="number" name='displacement' value={displacement} onChange={(e) => setDisplacement(e.target.value)}></input>

      <p>Axis:</p>
      <input type="text" name='displacement' value={axis} onChange={(e) => setAxis(e.target.value)}></input>

      <button type='submit'>Send</button>
    </form>
    <button onClick={e => clearCanvas(e)}>Clear board</button>
    </div>
  );
}

export default App;
