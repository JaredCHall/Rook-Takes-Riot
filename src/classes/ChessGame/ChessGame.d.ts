export interface PiecePositions {
    [key: string]: [piece: string, color: string]|null;
}

export interface SquareInfo {
    index: number,
    name: string,

    color: string,

    position: {[orientation: string]: [column: number, row: number]},
}