import ITurn from "./ITurn";
import Turn from "./Turn";
import { eAxis } from "./eAxis";
export class TurnManager {

  public get turns(): Array<Turn> { return this._turns };
  private _turns: Array<Turn>;

  constructor() {
    this._turns = new Array<Turn>();
  }

  public GetUsedTurnsCount(): number {
    return this._turns
      .map(turn => turn.index)
      .filter((number, index, list) => list.indexOf(number) === index)
      .length;
  }

  public GetCutsCount(): number {

    var cutsCount = 0;

    this._turns.forEach((turn) => {
      cutsCount += turn.getCutsCount();
    })

    return cutsCount;
  }

  public Start(firstTurnWidth: number, firstTurnHeight: number, firstCutAxis: eAxis): void {
    var maxAcceptableDisplacement, width, height = null;
    var startPosition = {
      X: 0,
      Y: 0
    }

    if (firstCutAxis === eAxis.Vertical) {
      maxAcceptableDisplacement = firstTurnWidth;
      width = firstTurnWidth;
      height = firstTurnHeight;
    } else {
      maxAcceptableDisplacement = firstTurnHeight;
      width = firstTurnWidth;
      height = firstTurnHeight;
    }

    var turn = new Turn(1, maxAcceptableDisplacement, startPosition, firstCutAxis, width, height);
    this._turns.push(turn);
  }

  public GetTurnByIndex(phaseIndex: number): Turn {
    var nextPhase = this.GetOpenedTurnByIndex(phaseIndex + 1);
    var currentPhase = this.GetOpenedTurnByIndex(phaseIndex);

    if (currentPhase) {
      if (nextPhase)
        this.CloseAllNextTurns(nextPhase);
    }
    else {
      var previousPhase = this.GetOpenedTurnByIndex(phaseIndex - 1);
      currentPhase = this.CreateNewPhase(previousPhase);
      this._turns.push(currentPhase);
    }

    return currentPhase;
  }

  private GetOpenedTurnByIndex = (choosedPhase: number): Turn => this._turns.filter(x => x.index == choosedPhase && x.closed === false)[0];

  private OppositeAxis = (axis: eAxis) => axis === eAxis.Horizontal ? eAxis.Vertical : eAxis.Horizontal;

  private CloseAllNextTurns(turn: Turn): void {
    turn.closeTurn();

    var nextPhase = this.GetOpenedTurnByIndex(turn.index + 1);

    if (nextPhase)
      this.CloseAllNextTurns(nextPhase);
  }

  private CreateNewPhase(previousPhase: Turn): Turn {
    var startPoint = null;
    var maxAcceptableDisplacement, width, height;
    var lastCut = previousPhase.cuts[previousPhase.cuts.length - 1];
    var lastDisplacement = lastCut.Displacement;
    var lastDisplacementWithMargin = (lastCut.Displacement + lastCut.Margin) ?? 0;
    var phaseNumber = previousPhase.index + 1;

    if (previousPhase.cutAxis == eAxis.Horizontal) {
      var positionY = previousPhase.usedDisplacement - lastDisplacementWithMargin;

      positionY = positionY >= 0 ? positionY : 0;

      startPoint = {
        X: previousPhase.startPoint.X,
        Y: positionY
      };
      var previsouPhaseWidth = previousPhase.width;
      maxAcceptableDisplacement = previsouPhaseWidth;
      width = previsouPhaseWidth;
      height = lastDisplacement;
    } else {

      var positionX = previousPhase.usedDisplacement - lastDisplacementWithMargin;

      positionX = positionX >= 0 ? positionX : 0;

      startPoint = {
        X: positionX,
        Y: previousPhase.startPoint.Y
      };

      var previousPhaseHeight = previousPhase.height;
      maxAcceptableDisplacement = previousPhaseHeight
      width = lastDisplacement;
      height = previousPhaseHeight;
    }

    return new Turn(phaseNumber, maxAcceptableDisplacement, startPoint, this.OppositeAxis(previousPhase.cutAxis), width, height);
  }
}