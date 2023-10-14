import ILineOptions from "../../components/Canvas/ILineOptions";
import Rect from "../../components/Canvas/Rect";
import CuttingPlanElement from "../../components/SandboxArea/CuttingPlanElements/CuttingPlanElement";
import { ePlacementType } from "../../components/SandboxArea/CuttingPlanElements/ePlacementType";
import IPosition from "../IPosition";
import { Utils } from "../Utils";
import ITurn from "./ITurn";
import { eAxis } from "./eAxis";

export class TurnToRectangleConverter {
    private _parts: Array<Rect>;
    private _aspectRatio: number;

    private ToPixels = (number: number) => Utils.ConvertMilimetersToPixels(number) / this._aspectRatio;

    private AddRect(
        Type: ePlacementType,
        width: number = 0,
        height: number = 0,
        x: number = 0,
        y: number = 0,
        backgroundColor: string = "",
        lineOptions: ILineOptions = null): void {
        var part = new CuttingPlanElement(Type, width, height, x, y, backgroundColor, lineOptions);
        this._parts.push(part);
    }

    private AddPart(
        width: number,
        height: number,
        x: number,
        y: number,
        lineOptions: ILineOptions = null): void {
        this.AddRect(ePlacementType.Part, width, height, x, y, "#46878A", lineOptions);
    }

    private AddRemainder(
        width: number,
        height: number,
        x: number,
        y: number,
        lineOptions: ILineOptions = null): void {
        this.AddRect(ePlacementType.Remainder, width, height, x, y, "#DFF1E6", lineOptions);
    }

    public ConvertTurn(turn: ITurn, margin: number, aspectRatio: number, startPoint: IPosition): Rect[] {

        this._parts = new Array<Rect>();
        this._aspectRatio = aspectRatio;

        var cutsSortedByIndex = turn.cuts.sort((a, b) => {
            if (a.Index < b.Index) {
                return -1;
            } else if (a.Index > b.Index) {
                return 1;
            }
            return 0;
        });

        var xTurn = this.ToPixels(turn.startPoint.X);
        var yTurn = this.ToPixels(turn.startPoint.Y);
        var currentStartPoint = { X: startPoint.X + xTurn, Y: startPoint.Y + yTurn };
        var lineOptions = {
            color: "#000",
            thickness: 1.3
        }

        if (turn.cutAxis === eAxis.Horizontal) {
            var widthInPixels = this.ToPixels(turn.width);
            var remainingHeight = this.ToPixels(turn.height);
            cutsSortedByIndex.forEach((cut) => {
                var displacementInPixels = this.ToPixels(cut.Displacement);
                this.AddPart(widthInPixels, displacementInPixels, currentStartPoint.X, currentStartPoint.Y, lineOptions);

                var marginInPixels = this.ToPixels(cut.Margin);
                var fullHeight = displacementInPixels + marginInPixels;
                remainingHeight = remainingHeight - fullHeight;
                currentStartPoint.Y = currentStartPoint.Y + fullHeight;
            });

            this.AddRemainder(widthInPixels, remainingHeight, currentStartPoint.X, currentStartPoint.Y, lineOptions);

        } else {
            var heightInPixels = this.ToPixels(turn.height);
            var remainingWidth = this.ToPixels(turn.width);
            cutsSortedByIndex.forEach((cut) => {
                var displacementInPixels = this.ToPixels(cut.Displacement);
                this.AddPart(displacementInPixels, heightInPixels, currentStartPoint.X, currentStartPoint.Y, lineOptions);

                var marginInPixels = this.ToPixels(cut.Margin);
                var fullWidth = displacementInPixels + marginInPixels;
                remainingWidth = remainingWidth - fullWidth;
                currentStartPoint.X = currentStartPoint.X + fullWidth;
            });

            this.AddRemainder(remainingWidth, heightInPixels, currentStartPoint.X, currentStartPoint.Y, lineOptions);
        }

        return this._parts;
    }
}