export interface PieceProps {
    pieceName: string,
    color: string,

    width: number,

    x: number,

    y: number,
}
export interface PieceState {}

export interface Piece extends RiotComponent<PieceProps, PieceState> {}