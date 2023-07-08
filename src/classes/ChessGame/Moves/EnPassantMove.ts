import BasicMove from './BasicMove'
import ChessPiece from "../ChessPiece";
import PiecePositions from "../GameState/PiecePositions";
export default class EnPassantMove extends BasicMove
{

    opponentPawnSquare: string

    constructor(move: BasicMove, capturedPiece: ChessPiece) {
        super(move.oldSquare, move.newSquare, move.movingPiece, capturedPiece);

        this.opponentPawnSquare = capturedPiece.currentSquare
    }

    static getOpponentPawnSquare(move: BasicMove): string
    {
        // @ts-ignore
        const newFile = move.newSquare.split('')[0]
        // @ts-ignore
        const startingRank = move.oldSquare.split('')[1]

        return newFile + startingRank
    }

    getMoves(): Array<BasicMove> {
        let moves = super.getMoves();

        // remove the opponent pawn by assigning its new square as null
        moves.push(new BasicMove(
            this.opponentPawnSquare,
            null,
            this.movingPiece,
            this.capturedPiece
        ))

        return moves
    }

}