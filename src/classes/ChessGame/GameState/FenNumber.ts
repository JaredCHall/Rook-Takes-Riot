import PiecePositions from "./PiecePositions";
import ChessPiece from "../ChessPiece";
import GameState from "./GameState";

export default class FenNumber {

    piecePlacements: string

    sideToMove: string

    castleRights: null|string

    enPassantTarget: null|string

    halfMoveClock: number

    fullMoveCounter: number

    constructor(fen: string) {

        const parts = fen.split(' ')

        this.piecePlacements = parts[0]
        this.sideToMove = parts[1] ?? 'w'
        this.castleRights = parts[2] ?? null
        this.enPassantTarget = parts[3] ?? null
        this.halfMoveClock = parseInt(parts[4]) ?? 0
        this.fullMoveCounter = parseInt(parts[5]) ?? 1

        if(this.castleRights == '-'){
            this.castleRights = null
        }
        if(this.enPassantTarget == '-'){
            this.enPassantTarget = null
        }
    }

    toString(): string {
        return [
            this.piecePlacements,
            this.sideToMove,
            this.castleRights == null ? '-' : this.castleRights,
            this.enPassantTarget == null ? '-' : this.enPassantTarget,
            this.halfMoveClock,
            this.fullMoveCounter
        ].join(' ')
    }

    clone(): FenNumber {
        return new FenNumber(this.toString())
    }

    isWhiteMoving() {
        return this.sideToMove === 'w'
    }

    incrementTurn(): void
    {
        const whiteIsMoving = this.isWhiteMoving()
        this.sideToMove = whiteIsMoving ? 'b' : 'w';

        if(!whiteIsMoving){
            this.fullMoveCounter++
        }
    }

    parsePiecePlacements(): PiecePositions
    {
        let positions: PiecePositions = {}

        const rows = this.piecePlacements.split('/').reverse()
        if(rows.length !== 8){
            throw new Error('FEN piece placement must include all eight rows')
        }

        const columnNames = ['a','b','c','d','e','f','g','h']
        for(let rowNumber=8;rowNumber>0;rowNumber--){
            const chars = rows[rowNumber-1].split('')
            let columnNumber=1;
            for(let i=0;i<chars.length;i++){
                const character = chars[i]
                if(/[1-8]/.test(character)){
                    const emptySpaces = parseInt(character)
                    const lastEmptySpace = columnNumber + emptySpaces - 1
                    while(columnNumber <= lastEmptySpace){
                        const squareName = columnNames[columnNumber-1]+rowNumber.toString()
                        positions[squareName] = null
                        columnNumber++
                    }
                }else if(/[rbnqkpRBNQKP]/.test(character)) {

                    const squareName = columnNames[columnNumber-1]+rowNumber.toString()
                    const piece = new ChessPiece(character, squareName)
                    positions[squareName] = piece
                    columnNumber++
                }else{
                    throw new Error("Unrecognized position character: "+character)
                }
            }
        }

        return positions
    }

    static fromGameState(gameState: GameState): FenNumber
    {
        const fenNumber = gameState.fenNumber

        console.log(gameState.mailbox144.piecePositions)
        const columnNames = ['a','b','c','d','e','f','g','h']
        let emptySquares = 0

        let fen = ''
        for(let row=8;row>=1;row--){
            for(let col =1; col<=8;col++){
                const squareName = columnNames[col - 1] + row.toString()
                const piece = gameState.mailbox144.piecePositions[squareName]

                if(piece) {
                    if(emptySquares > 0){
                        fen += emptySquares.toString()
                        emptySquares = 0
                    }
                    fen += piece.toFen()
                }else{
                    emptySquares++
                }
            }

            if(emptySquares > 0){
                fen += emptySquares.toString()
                emptySquares = 0
            }
            if(row > 1){
                fen += '/'
            }
        }

        fen += ' '
        fen += fenNumber.sideToMove
        fen += ' '
        fen += fenNumber.castleRights == null ? '-' : fenNumber.castleRights;
        fen += ' '
        fen += fenNumber.enPassantTarget == null ? '-' : fenNumber.enPassantTarget;
        fen += ' '
        fen += fenNumber.halfMoveClock
        fen += ' '
        fen += fenNumber.fullMoveCounter

        console.log(fen);

        return new FenNumber(fen);
    }


}