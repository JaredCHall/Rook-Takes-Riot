import {ChessboardComponent} from "Chessboard/chessboard.d";
import {RiotComponent} from "riot";

export interface BoardOptionsProps {
    board: ChessboardComponent
}

export interface BoardOptionsState {
    fenError: string,
}

export interface BoardOptionsComponent extends RiotComponent<BoardOptionsProps,BoardOptionsState> {
    setFen(fen: string): void,

    clearFenError(): void,

    randomPuzzle(): void,

    board: ChessboardComponent,
}