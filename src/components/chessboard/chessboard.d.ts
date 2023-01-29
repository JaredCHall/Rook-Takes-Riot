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
    flipBoard(): void,
    toggleLabels(): void,

    getFen(): string,

    orientBoard(color: string): void,

    setPosition(fen: string): void,

    getSquare(name: string): Element,
}