import ILineOptions from "../../components/Canvas/ILineOptions";
import Rect from "../../components/Canvas/Rect";
import IPosition from "../IPosition";
import { Utils } from "../Utils";
import ITurn from "./ITurn";
import { eAxis } from "./eAxis";

export class TurnToRectangleConverter {
    private _parts: Array<Rect>;
    private _aspectRatio: number;

    private ToPixels = (number: number) => Utils.ConvertMilimetersToPixels(number) / this._aspectRatio;

    private AddPart(
        width: number = 0,
        height: number = 0,
        x: number = 0,
        y: number = 0,
        backgroundColor: string = "",
        lineOptions: ILineOptions = null): void {
        var part = new Rect(width, height, x, y, backgroundColor, lineOptions);
        this._parts.push(part);
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
        var marginInPixels = this.ToPixels(margin);
        var lineOptions = {
            color: "#000",
            thickness: 1.3
        }

        if (turn.cutAxis === eAxis.Horizontal) {
            var widthInPixels = this.ToPixels(turn.width);
            var remainingHeight = this.ToPixels(turn.height);
            cutsSortedByIndex.forEach((cut) => {
                var displacementInPixels = this.ToPixels(cut.Displacement);
                this.AddPart(widthInPixels, displacementInPixels, currentStartPoint.X, currentStartPoint.Y, "#46878A", lineOptions);

                var fullHeight = displacementInPixels + marginInPixels;
                remainingHeight = remainingHeight - fullHeight;
                currentStartPoint.Y = currentStartPoint.Y + fullHeight;
            });

            this.AddPart(widthInPixels, remainingHeight, currentStartPoint.X, currentStartPoint.Y, "#DFF1E6", lineOptions);

        } else {
            var heightInPixels = this.ToPixels(turn.height);
            var remainingWidth = this.ToPixels(turn.width);
            cutsSortedByIndex.forEach((cut) => {
                var displacementInPixels = this.ToPixels(cut.Displacement);
                this.AddPart(displacementInPixels, heightInPixels, currentStartPoint.X, currentStartPoint.Y, "#46878A", lineOptions);

                var fullWidth = displacementInPixels + marginInPixels;
                remainingWidth = remainingWidth - fullWidth;
                currentStartPoint.X = currentStartPoint.X + fullWidth;
            });

            this.AddPart(remainingWidth, heightInPixels, currentStartPoint.X, currentStartPoint.Y, "#DFF1E6", lineOptions);
        }

        return this._parts;
    }
}