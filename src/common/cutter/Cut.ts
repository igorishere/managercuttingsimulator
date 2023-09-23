export default class Cut {

    public get Displacement(): number { return this._displacement };
    private _displacement: number

    public get Index(): number { return this._index };
    private _index: number

    constructor(displacement: number, index: number) {
        this._displacement = displacement;
        this._index = index;
    }
}