import ICommand from "./interfaces/ICommand";
export default class Command implements ICommand{
    displacement: number;
    axis: string; 

    constructor (displacement?: number, axis?: string){

        if(displacement === null){
            displacement = 0;
        }

        if(axis === null){
            axis = "";
        }  

        this.displacement = displacement;
        this.axis = axis;
    }
}