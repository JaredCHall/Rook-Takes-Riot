import BasicMove from './BasicMove'
import ChessPiece from "../ChessPiece";
import PiecePositions from "../PiecePositions";
export default class DoublePawnMove extends BasicMove
{
    constructor(move: BasicMove) {
        super(move.oldSquare, move.newSquare, move.piece);
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