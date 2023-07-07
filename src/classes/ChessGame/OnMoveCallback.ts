import BasicMove from "./Moves/BasicMove";

export default interface OnMoveCallback {
    (move: BasicMove): void;
}