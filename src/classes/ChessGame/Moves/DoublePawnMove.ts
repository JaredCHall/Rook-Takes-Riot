import BasicMove from './BasicMove'
import ChessPiece from "../ChessPiece";
import PiecePositions from "../PiecePositions";
export default class DoublePawnMove extends BasicMove
{
    constructor(move: BasicMove) {
        super(move.oldSquare, move.newSquare, move.piece);
    }

    static isDoublePawnMove(move: BasicMove): boolean {
        if(
            move.piece === null
            || move.piece.type !== 'pawn'
            || move.oldSquare === null
            || move.newSquare === null
        ){
            return false
        }
        const startingRank = parseInt(move.oldSquare.split('')[1])
        const endingRank = parseInt(move.newSquare.split('')[1])
        if(Math.abs(endingRank - startingRank) === 2){
            return true;
        }

        return false
    }

    getEnPassantTargetSquare(): string
    {
        if(this.newSquare === null){
            throw new Error('this.newSquare is null')
        }

        if(this.piece === null){
            throw new Error('this.piece is null')
        }

        const targetRank = parseInt(this.newSquare.split('')[1]) - (this.piece.color == 'white' ? 1 : -1)
        const file = this.newSquare.split('')[0];
        return file + targetRank.toString()
    }
}