// @ts-ignore
import ChessGame from 'ChessGame/ChessGame.ts'
import {RiotComponent} from "riot";
import {SquareComponent} from "./square/square";
export interface ChessboardProps {
    title: string,

    showOptions: boolean,

    selectedSquare: string,
}
export interface ChessboardState {
    orientation: string,
    showLabels: boolean,
    showPieces: boolean,
    title: string,
    showOptions: boolean,
    selectedSquare: string,
}

export interface ChessboardComponent extends RiotComponent<ChessboardProps, ChessboardState> {

    squares: Array<SquareComponent>,

    gamePosition: ChessGame,

    flipBoard(): void,
    toggleLabels(): void,

    getFen(): string,

    orientBoard(color: string): void,

    getPosition(): ChessGame,

    setPosition(fen: string): void,

    getSquare(name: string): SquareComponent,

    getSquareNames(): Array<string>,


}