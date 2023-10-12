export default class Cut {

    public get Displacement(): number { return this._displacement };
    private _displacement: number

    public get Index(): number { return this._index };
    private _index: number

    public get Margin(): number {return this._margin};
    private _margin: number;

    constructor(displacement: number,margin:number, index: number) {
        this._displacement = displacement;
        this._index = index;
        this._margin = margin;
    }
}