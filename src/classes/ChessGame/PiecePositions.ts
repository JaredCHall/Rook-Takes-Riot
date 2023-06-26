import ChessPiece from "./ChessPiece";

export default interface PiecePositions {
    [key: string]: ChessPiece|null;
}
