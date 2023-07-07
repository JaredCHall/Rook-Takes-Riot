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