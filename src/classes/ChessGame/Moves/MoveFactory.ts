import BasicMove from "./BasicMove";
import PiecePositions from "../PiecePositions";
import CastlingMove from "./CastlingMove";

export default class MoveFactory
{
    static make(oldSquare: string, newSquare:string, positions: PiecePositions): BasicMove
    {
        let move = new BasicMove(oldSquare, newSquare, positions)

        // Handle castling moves
        const castlesType = CastlingMove.getCastlingType(move)
        if(castlesType !== null){
            const rooksSquare = CastlingMove.getRooksStartingSquare(castlesType)
            const rook = positions[rooksSquare]

            if(rook === null){
                throw new Error('Rook is not where expected')
            }

            return new CastlingMove(move, rook)
        }

        return move
    }
}