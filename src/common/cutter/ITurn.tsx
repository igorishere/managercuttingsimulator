import { eAxis } from './eAxis';
import IPosition from '../IPosition';
export default interface ITurn{
    index: number;
    maxAcceptableDisplacement: number;
    usedDisplacement: number;
    startPoint: IPosition;
    cutAxis: eAxis;
    closed: boolean;
    width: number;
    height:number;  
    cutsCount: number;
};