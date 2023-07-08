import MailboxAddress from "./MailboxAddress";
import ChessPiece from "../ChessPiece";

export default class PieceList {

    white:     Array<ChessPiece> = [];
    black:     Array<ChessPiece> = [];

    add(piece: ChessPiece){
        this.#getListForColor(piece.color).push(piece)
    }

    remove(piece: ChessPiece){
        const list = this.#getListForColor(piece.color)
        for(let i = 0; i < list.length; i++){
            if(piece === list[i]){
                list.splice(i,1)
            }
        }
    }

    #getListForColor(color: string): ChessPiece[] {
        return color === 'white' ? this.white : this.black
    }

}
