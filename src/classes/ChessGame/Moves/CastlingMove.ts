import BasicMove from './BasicMove'
import ChessPiece from "../ChessPiece";
export default class CastlingMove extends BasicMove
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

    static getRooksStartingSquare(castlesType: string): string {
        return this.rookMoves[castlesType][0]
    }

    static getCastlingType(move: BasicMove): string|null
    {
        if(move.piece === null){
            return null
        }

        const isKing = move.piece.type === 'king'
        const isWhite = move.piece.color === 'white'

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

    constructor(move: BasicMove, rook: ChessPiece) {
        super(move.oldSquare, move.newSquare, move.positions);
        const castlesType = CastlingMove.getCastlingType(this);
        if(castlesType === null){
            throw new Error('Invalid castlesType')
        }
        this.castlesType = castlesType
        this.rook = rook
    }

    getMoves(): Array<BasicMove> {
        let moves = super.getMoves();

        moves.push(new BasicMove(
            CastlingMove.rookMoves[this.castlesType][0],
            CastlingMove.rookMoves[this.castlesType][1],
            this.positions
        ))

        return moves
    }

}