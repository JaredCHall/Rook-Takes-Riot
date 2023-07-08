import BasicMove from "./BasicMove";

export default interface ChessMove {
    [squareName: string]: BasicMove;
}