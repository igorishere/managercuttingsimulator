import Turn from "./Turn";
import { eAxis } from "./eAxis";
export class TurnManager{
    
    public get turns(): Array<Turn> { return this._turns };
    private _turns: Array<Turn>;

    constructor(){
      this._turns = new Array<Turn>();
    }

    public Start(firstTurnWidth: number, firstTurnHeight: number, firstCutAxis: eAxis): void{
        var maxAcceptableDisplacement, width,height = null;  
        var startPosition = {
            X: 0,
            Y: 0
        }

        if(firstCutAxis === eAxis.Vertical){
          maxAcceptableDisplacement = firstTurnWidth;
          width = firstTurnWidth;
          height = firstTurnHeight;
        }else{
          maxAcceptableDisplacement =firstTurnHeight;
          width = firstTurnWidth;
          height = firstTurnWidth;
        }
  
        var turn = new Turn(1,maxAcceptableDisplacement,startPosition,firstCutAxis,width,height);
        this._turns.push(turn);
    }

    public GetTurnByIndex(phaseNumber: number,lastDisplacementAxisY: number,lastDisplacementAxisX: number ): Turn {
  
        var previousPhase = this.GetOpenedTurnByIndex(phaseNumber-1);
        var currentPhase = this.GetOpenedTurnByIndex(phaseNumber);
        var nextPhase = this.GetOpenedTurnByIndex(phaseNumber+1);
    
        if(currentPhase)
        {
          if(nextPhase)  
            this.CloseAllNextTurns(nextPhase);
          
          return currentPhase;
        }
    
        if(previousPhase){
          
          var startPoint = null;
          var maxAcceptableDisplacement,width,height;
    
          if(previousPhase.cutAxis == eAxis.Horizontal){
            var positionY = previousPhase.usedDisplacement - lastDisplacementAxisY;
    
           positionY =  positionY >= 0 ? positionY : 0;
    
            startPoint ={
              X: previousPhase.startPoint.X,
              Y: positionY
            };
    
            maxAcceptableDisplacement = previousPhase.width;
            width = previousPhase.width;
            height = lastDisplacementAxisY;
          }else{
            
            var positionX = previousPhase.usedDisplacement - lastDisplacementAxisX;
    
            positionX = positionX >= 0 ? positionX : 0; 
    
            startPoint ={
              X: positionX,
              Y: previousPhase.startPoint.Y
            };
    
            maxAcceptableDisplacement = previousPhase.height;
            width = lastDisplacementAxisX;
            height = previousPhase.height;
          }
    
          currentPhase = new Turn(phaseNumber,maxAcceptableDisplacement,startPoint,this.OppositeAxis(previousPhase.cutAxis),width,height);
          
          this._turns.push(currentPhase);
        }
    
        return currentPhase;
      }

      private GetOpenedTurnByIndex = (choosedPhase: number): Turn => this._turns.filter( x => x.index == choosedPhase && x.closed === false)[0];

      private OppositeAxis = (axis: eAxis) => axis === eAxis.Horizontal ? eAxis.Vertical : eAxis.Horizontal;

      private CloseAllNextTurns(turn: Turn): void{
        turn.closeTurn();

        var nextPhase = this.GetOpenedTurnByIndex(turn.index+1);

        if(nextPhase)
          this.CloseAllNextTurns(nextPhase);
      }
}