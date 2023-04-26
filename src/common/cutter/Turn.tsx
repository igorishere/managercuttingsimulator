import IPosition from "../IPosition";
import ITurn from "./ITurn";  
import { eAxis } from "./eAxis";

export default class Turn implements ITurn{

    readonly index: number;
    readonly startPoint: IPosition;
    readonly cutAxis: eAxis;
    readonly width: number;
    readonly height: number;
    public get closed(): boolean {return this._closed};
    private _closed: boolean;
    public get maxAcceptableDisplacement(): number { return this._maxAcceptableDisplacement };
    private _maxAcceptableDisplacement: number;
    public get usedDisplacement(): number { return this._usedDisplacement };
    private _usedDisplacement: number;
    
    constructor(index: number, maxAcceptableDisplacement: number, startPoint: IPosition, axis: eAxis,width: number,height:number){
        this.index = index !== null ? index : null;
        this.startPoint = startPoint !== null ? startPoint : null;
        this.cutAxis = axis;
        this.width = width;
        this.height = height;
        this._maxAcceptableDisplacement = maxAcceptableDisplacement !== null ? maxAcceptableDisplacement : null;
        this._usedDisplacement = 0;
        this._closed = false;
    }
    
    public updateUsedDisplacement(displacement:number): void {
        if(this._closed === true) return;

        this._usedDisplacement = this._usedDisplacement + displacement;
        this._maxAcceptableDisplacement = this._maxAcceptableDisplacement - displacement;
    }

    public closeTurn(): void{
        this._closed = true;
    }
}