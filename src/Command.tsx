import ICommand from "./interfaces/ICommand";
export default class Command implements ICommand{
    displacement: number;
    axis: string; 
    index: number;

    constructor (displacement?: number, axis?: string, index?: number){

        if(displacement === null){
            displacement = 0;
        }

        if(axis === null){
            axis = "";
        }
        
        if(index === null){
            index = -1;
        }  

        this.displacement = displacement;
        this.axis = axis;
        this.index = index;
    }
}