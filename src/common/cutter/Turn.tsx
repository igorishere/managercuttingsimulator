import IPosition from "../IPosition";
import Cut from "./Cut";
import ITurn from "./ITurn";
import { eAxis } from "./eAxis";

export default class Turn implements ITurn {

    readonly index: number;
    readonly startPoint: IPosition;
    readonly cutAxis: eAxis;
    readonly width: number;
    readonly height: number;
    public get cuts(): Cut[] { return this._cuts };
    private _cuts: Cut[]; public get closed(): boolean { return this._closed };
    private _closed: boolean;
    public get maxAcceptableDisplacement(): number { return this._maxAcceptableDisplacement };
    private _maxAcceptableDisplacement: number;
    public get usedDisplacement(): number { return this._usedDisplacement };
    private _usedDisplacement: number;

    constructor(index: number, maxAcceptableDisplacement: number, startPoint: IPosition, axis: eAxis, width: number, height: number) {
        this.index = index !== null ? index : null;
        this.startPoint = startPoint !== null ? startPoint : null;
        this.cutAxis = axis;
        this.width = width;
        this.height = height;
        this._maxAcceptableDisplacement = maxAcceptableDisplacement !== null ? maxAcceptableDisplacement : null;
        this._usedDisplacement = 0;
        this._cuts = new Array<Cut>();
        this._closed = false;
    }

    public executeCut(displacement: number, margin: number): void {
        if (this._closed === true) return;

        const displacementWithCut = displacement + margin;
        this._usedDisplacement = this._usedDisplacement + displacementWithCut;
        this._maxAcceptableDisplacement = this._maxAcceptableDisplacement - displacementWithCut;

        var lastCut = this._cuts[this._cuts.length - 1];

        var index;

        if (lastCut) {
            index = lastCut.Index + 1;
        } else {
            index = 1;
        }

        var cut = new Cut(displacement, index);
        this._cuts.push(cut);
    }

    public closeTurn(): void {
        this._closed = true;
    }
    public getCutsCount(): number { return this._cuts.length }
}