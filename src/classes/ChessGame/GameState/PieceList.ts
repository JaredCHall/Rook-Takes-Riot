import MailboxAddress from "./MailboxAddress";
import ChessPiece from "../ChessPiece";

export default class PieceList {

    data:     Array<ChessPiece> = [];

    add(piece: ChessPiece){
        this.data.push(piece)
    }

    remove(piece: ChessPiece){
        for(let i = 0; i < this.data.length; i++){
            if(piece === this.data[i]){
                this.data.splice(i,1)
            }
        }
    }

}
