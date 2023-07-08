import ChessPiece from "../ChessPiece";

/**
 * This is any move or capture.
 * The moving piece vacates the old square and occupies the new one (replacing any existing piece)
 *
 * Some moves, such as castling or enPassant, may involve multiple basic moves
 */
export default class BasicMove {

    oldSquare: string

    newSquare: string|null // null means removing the piece from the board

    movingPiece: ChessPiece

    capturedPiece: ChessPiece|null

    constructor(oldSquare: string, newSquare:string|null, movingPiece: ChessPiece, capturedPiece: ChessPiece | null = null) {
        this.oldSquare = oldSquare
        this.newSquare = newSquare
        this.movingPiece = movingPiece
        this.capturedPiece = capturedPiece
    }
}