import IPosition from './IPosition';
export default interface ITurn{
    index: number;
    maxAcceptableDisplacement: number;
    startPoint: IPosition;
};