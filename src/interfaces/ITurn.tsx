import IPosition from './IPosition';
export default interface ITurn{
    index: number;
    maxAcceptableDisplacement: number;
    usedDisplacement: number;
    startPoint: IPosition;
    cutAxis: string;
    closed: boolean;
    width: number;
    height:number; 
};