
import ChessPiece from "../ChessPiece";
import ChessMove from "./ChessMove";
import MoveStep from "./MoveStep";
export default class CastlingMove extends ChessMove
{
    static KING_SIDE_WHITE = 'K'
    static QUEEN_SIDE_WHITE = 'Q'
    static KING_SIDE_BLACK = 'k'
    static QUEEN_SIDE_BLACK = 'q'

    rook: ChessPiece

    castlesType: string

    static rookMoves: {[castlesType: string]: Array<string>} = {
        K: ['h1','f1'],
        Q: ['a1','d1'],
        k: ['h8','f8'],
        q: ['a8','d8'],
    }

    constructor(oldSquare: string, newSquare:string, movingPiece: ChessPiece, rook: ChessPiece) {
        super(oldSquare, newSquare, movingPiece, null)
        const castlesType = CastlingMove.getCastlingType(this);
        if(castlesType === null){
            throw new Error('Invalid castlesType')
        }
        this.castlesType = castlesType
        this.rook = rook
    }

    static getCastlingType(move: ChessMove): string|null
    {
        if(move.movingPiece === null){
            return null
        }

        const isKing = move.movingPiece.type === 'king'
        const isWhite = move.movingPiece.color === 'white'

        if (!isKing) {
            return null
        }

        if( isWhite && move.oldSquare === 'e1') {
            switch(move.newSquare){
                case 'g1': return this.KING_SIDE_WHITE
                case 'c1': return this.QUEEN_SIDE_WHITE
            }
        }else if (!isWhite && move.oldSquare === 'e8') {
            switch(move.newSquare){
                case 'g8': return this.KING_SIDE_BLACK
                case 'c8': return this.QUEEN_SIDE_BLACK
            }
        }

        return null
    }

    static getCastlesTypeByRook(rook: ChessPiece): string|null{
        switch(rook.startingSquare){
            case 'a1': return 'Q'
            case 'h1': return 'K'
            case 'a8': return 'q'
            case 'h8': return 'k'
            default: return null
        }
    }

    getMoveSteps(): Array<MoveStep> {
        const steps = super.getMoveSteps()
        const rookMoveSteps = this.getRookMove().getMoveSteps()

        return steps.concat(rookMoveSteps)
    }

    getUndoSteps(): Array<MoveStep> {
        const kingUndoSteps = super.getUndoSteps();
        const rookUndoSteps = this.getRookMove().getUndoSteps()

        return kingUndoSteps.concat(rookUndoSteps)
    }

    getRookMove(): ChessMove
    {
        const oldSquare = CastlingMove.rookMoves[this.castlesType][0]
        const newSquare = CastlingMove.rookMoves[this.castlesType][1]
        return new ChessMove(oldSquare, newSquare, this.rook)
    }

}