// @ts-ignore
//import {PiecePositions} from '../ChessGame.d'

import ChessPiece from "../ChessPiece";
import PiecePositions from "../PiecePositions";


/**
 * This is any normal move or capture
 * The moving piece vacates the old square and occupies the new one (replacing any existing piece)
 */
export default class BasicMove {

    oldSquare: string|null

    newSquare: string|null

    positions: PiecePositions

    piece: ChessPiece|null = null

    constructor(oldSquare: string|null, newSquare:string|null, positions: PiecePositions) {
        this.oldSquare = oldSquare
        this.newSquare = newSquare
        this.positions = positions
        if(oldSquare !== null){
            this.piece = positions[oldSquare]
        }
    }
    getMoves(): Array<BasicMove>
    {
        return [this]
    }
}