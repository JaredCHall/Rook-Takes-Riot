import BasicMove from "./Moves/BasicMove";

export interface OnMoveCallback {
    (move: BasicMove): void;
}