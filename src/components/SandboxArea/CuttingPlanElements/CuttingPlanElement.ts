import ILineOptions from "../../Canvas/ILineOptions";
import Rect from "../../Canvas/Rect";
import {ePlacementType} from "./ePlacementType"; 

export default class CuttingPlanElement extends Rect {
    public readonly elementType: ePlacementType;
    constructor(type: ePlacementType, width: number = 0, height: number = 0, x: number = 0, y: number = 0, backgroundColor: string = "", lineOptions: ILineOptions = null) {
        super(width, height, x, y, backgroundColor, lineOptions);
        this.elementType = type;
    }
}