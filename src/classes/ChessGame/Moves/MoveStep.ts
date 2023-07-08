import ChessPiece from "../ChessPiece";

export default class MoveStep {

    squareName: string

    piece: ChessPiece|null

    constructor(squareName: string, piece: ChessPiece|null) {
        this.squareName = squareName
        this.piece = piece
    }

}