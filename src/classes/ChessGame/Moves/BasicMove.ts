import ChessPiece from "../ChessPiece";

/**
 * This is any normal move or capture
 * The moving piece vacates the old square and occupies the new one (replacing any existing piece)
 */
export default class BasicMove {

    oldSquare: string

    newSquare: string|null

    piece: ChessPiece|null = null

    constructor(oldSquare: string, newSquare:string|null, piece: ChessPiece|null) {
        this.oldSquare = oldSquare
        this.newSquare = newSquare
        this.piece = piece
    }
    getMoves(): Array<BasicMove>
    {
        return [this]
    }
}