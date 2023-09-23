import { eAxis } from './eAxis';
import IPosition from '../IPosition';
import Cut from './Cut';
export default interface ITurn {
    index: number;
    maxAcceptableDisplacement: number;
    usedDisplacement: number;
    startPoint: IPosition;
    cutAxis: eAxis;
    closed: boolean;
    width: number;
    height: number; 
    cuts: Cut[];
};