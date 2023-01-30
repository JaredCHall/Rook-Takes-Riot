import {RiotComponent} from "riot";

export interface SquareProps {
    name: string,
    width: number,
    index: number,

    selected: boolean,

    color: string,

}

export interface SquareState {
    x: number,

    y: number,

    selected: boolean,

    showLabel: boolean,

    gamePiece: string,

    gamePieceColor: string,

    color: string,

    orientation: string,
}

export interface SquareComponent extends RiotComponent<SquareProps,SquareState> {

    getXYPosition(index: number, orientation: string): Array<number>

    setOrientation(orientation: string): void,
    setPiece(type: string, color: string): void,

    select(isSelected: boolean): void,
    toggleLabel(): void,
}