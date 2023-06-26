export default interface SquareInfo {
    index: number,
    name: string,

    color: string,

    position: {[orientation: string]: [column: number, row: number]},
}