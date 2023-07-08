import ChessMove from "./Moves/ChessMove";

export default interface OnMoveCallback {
    (move: ChessMove): void;
}