import BasicMove from "./BasicMove";

export default interface MoveList {
    [squareName: string]: BasicMove;
}