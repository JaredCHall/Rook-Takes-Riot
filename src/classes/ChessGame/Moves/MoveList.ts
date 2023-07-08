import ChessMove from "./ChessMove";

export default interface MoveList {
    [squareName: string]: ChessMove;
}