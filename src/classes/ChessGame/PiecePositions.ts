import ChessPiece from "./ChessPiece";

export default interface PiecePositions {
    [squareName: string]: ChessPiece|null;
}
