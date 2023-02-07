import IPosition from './IPosition';
export default interface ITurn{
    index: number;
    maxAcceptableDisplacement: number;
    usedDisplacement: number;
    startPoint: IPosition;
    axis: string;

    width: number;
    height:number;
};