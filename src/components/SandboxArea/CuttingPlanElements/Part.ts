import ILineOptions from "../../Canvas/ILineOptions";
import Rect from "../../Canvas/Rect";

export default class Part extends Rect {
    constructor(width: number = 0, height: number = 0, x: number = 0, y: number = 0, backgroundColor: string = "", lineOptions: ILineOptions = null) {
        super(width, height, x, y, backgroundColor, lineOptions)
    }
}