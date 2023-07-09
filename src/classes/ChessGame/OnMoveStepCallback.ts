import MoveStep from "./Moves/MoveStep";

export default interface OnMoveStepCallback {
    (step: MoveStep): void;
}