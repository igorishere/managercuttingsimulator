import IPosition from "./interfaces/IPosition";
import ITurn from "./interfaces/ITurn";

export default class Turn implements ITurn{

    index: number;
    maxAcceptableDisplacement: number;
    usedDisplacement: number;
    startPoint: IPosition;
    axis: string;

    constructor(index?: number, maxAcceptableDisplacement?: number, startPoint?: IPosition, axis?: string){
        this.index = index !== null ? index : null;
        this.maxAcceptableDisplacement = maxAcceptableDisplacement !== null ? maxAcceptableDisplacement : null;
        this.startPoint = startPoint !== null ? startPoint : null;
        this.axis = axis;
        this.usedDisplacement = 0;
    }
    
    public updateUsedDisplacement(displacement:number): void {
        this.usedDisplacement = this.usedDisplacement + displacement;
    }
}