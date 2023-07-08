import BasicMove from './BasicMove'
import ChessPiece from "../ChessPiece";
import PiecePositions from "../GameState/PiecePositions";
export default class DoublePawnMove extends BasicMove
{
    constructor(move: BasicMove) {
        super(move.oldSquare, move.newSquare, move.movingPiece);
    }

    getEnPassantTargetSquare(): string
    {
        if(this.newSquare === null){
            throw new Error('this.newSquare is null')
        }

        if(this.movingPiece === null){
            throw new Error('this.piece is null')
        }

        const targetRank = parseInt(this.newSquare.split('')[1]) - (this.movingPiece.color == 'white' ? 1 : -1)
        const file = this.newSquare.split('')[0];
        return file + targetRank.toString()
    }
}