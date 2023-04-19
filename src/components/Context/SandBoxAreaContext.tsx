import React,{ createContext, useState,useContext } from 'react';

interface State<T>{
    value: T,
    setValue: (value: T) => void;
}

interface SandBoxAreaParameters{
    boardWidth: State<number>,
    boardHeight: State<number>,
    displacement: State<number>,
    phaseNumber: State<number>
}

export function useSandBoxAreaContext(){
    return useContext(SandBoxAreaContext);
}

const SandBoxAreaContext = createContext<SandBoxAreaParameters>(null);

interface SandBoxAreaContextProviderProps{
    children?: React.ReactNode
}

function SandBoxAreaContextProvider(props: SandBoxAreaContextProviderProps){

    const [boardWidth,setBoardWidth] = useState(2750);
    const updateBoardWidth = (value: number)=>{
        setBoardWidth(value);
    } 

    const [boardHeight,setBoardHeight] = useState(1850);
    const updateBoardHeight = (value: number)=>{
        setBoardHeight(value);
    } 

    const [displacement,setDisplacement] = useState(0);
    const updateDisplacement = (value: number)=>{
        setDisplacement(value);
    } 
    
    const [phaseNumber,setPhaseNumber] = useState(1);
    const updatePhaseNumber = (value: number)=>{
        setPhaseNumber(value);
    } 

    const context = {
        boardWidth:        
        {
            value: boardWidth,
            setValue: updateBoardWidth
        }
        ,
        boardHeight: {
            value: boardHeight,
            setValue: updateBoardHeight
        },
        displacement: {
            value: displacement,
            setValue: updateDisplacement
        },
        phaseNumber:{
            value: phaseNumber,
            setValue: updatePhaseNumber
        }
    };
    

    return (
        <SandBoxAreaContext.Provider value={context}>
            {props.children}
        </SandBoxAreaContext.Provider>
    )
}

export default SandBoxAreaContextProvider;