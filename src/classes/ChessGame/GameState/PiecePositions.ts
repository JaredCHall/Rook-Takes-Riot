import ChessPiece from "../ChessPiece";

export default class PiecePositions {

    squares: {[square: string]: ChessPiece|null} = {}

    get(square: string): null|ChessPiece
    {
        return this.squares[square]
    }

    put(square: string, piece: null|ChessPiece): void
    {
        this.squares[square] = piece
    }

    clone(): PiecePositions
    {
        const positions = new PiecePositions()
        for(const squareName in this.squares){
            const piece = this.squares[squareName]
            positions.put(squareName, piece === null ? null : piece.clone())
        }
        return positions
    }
}
