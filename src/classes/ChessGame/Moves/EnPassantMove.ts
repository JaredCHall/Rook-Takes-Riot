import BasicMove from './BasicMove'
import ChessPiece from "../ChessPiece";
import PiecePositions from "../PiecePositions";
export default class EnPassantMove extends BasicMove
{

    opponentPawnSquare: string


    constructor(move: BasicMove) {
        super(move.oldSquare, move.newSquare, move.piece);

        this.opponentPawnSquare = this.getOpponentPawnSquare()
    }

    static isEnPassantMove(move: BasicMove, positions: PiecePositions): boolean {
        if(
            move.piece === null
            || move.piece.type !== 'pawn'
            || move.oldSquare === null
            || move.newSquare === null
        ){
            return false
        }
        const isWhite = move.piece.color === 'white'
        const isCapture = positions[move.newSquare] !== null
        const oldFile = move.oldSquare.split('')[0]
        const newFile = move.newSquare.split('')[0]
        const startingRank = move.oldSquare.split('')[1]

        if(isCapture){
           return false
        }

        if(isWhite && startingRank !== '5'){
            return false
        }else if(!isWhite && startingRank !== '4'){
            return false
        }

        if(oldFile !== newFile){
            return true
        }

        return false
    }

    getOpponentPawnSquare(): string
    {
        // @ts-ignore
        const isWhite = this.piece.color === 'white'
        // @ts-ignore
        const newFile = this.newSquare.split('')[0]
        // @ts-ignore
        const startingRank = this.oldSquare.split('')[1]

        return newFile + startingRank
    }

    getMoves(): Array<BasicMove> {
        let moves = super.getMoves();

        // remove the opponent pawn by assigning its new square as null
        moves.push(new BasicMove(
            this.opponentPawnSquare,
            null,
            this.piece
        ))

        return moves
    }

}