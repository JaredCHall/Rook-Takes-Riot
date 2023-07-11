import ChessMove from "./ChessMove";
import ChessPiece from "../ChessPiece";

export default class PawnPromotionMove extends ChessMove
{

    promoteToType: string = 'queen'

    constructor(chessMove: ChessMove) {
        super(chessMove.oldSquare, chessMove.newSquare, chessMove.movingPiece, chessMove.capturedPiece)

        if(chessMove.movingPiece.type !== 'pawn'){
            throw new Error('Not a pawn')
        }

        if(!PawnPromotionMove.squareIsOnFinalRank(this.newSquare, this.movingPiece)){
            throw new Error('Not on final rank')
        }
    }

    static squareIsOnFinalRank(squareName:string, piece: ChessPiece): boolean
    {
        const expectedRank = piece.color === 'white' ? '8' : '1'
        return squareName.charAt(1) === expectedRank
    }

}