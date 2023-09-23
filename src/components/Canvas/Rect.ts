import ILineOptions from "./ILineOptions";

export default class Rect {

    width: number;
    height: number;
    x: number;
    y: number;
    backgroundColor: string;

    lineOptions: ILineOptions

    constructor(width: number = 0, height: number = 0, x: number = 0, y: number = 0, backgroundColor: string = "", lineOptions: ILineOptions = null) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.backgroundColor = backgroundColor;
        this.lineOptions = lineOptions
    }
}