import GameState from "./GameState";
import PiecePositions from "./PiecePositions";
import ChessPiece from "../ChessPiece";

export default class FenParser {

    static parsePiecePlacements(fenPart: string): PiecePositions
    {
        let positions: PiecePositions = {}

        const rows = fenPart.split('/').reverse()
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

    static calculateFen(gameState: GameState): string
    {

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
        fen += gameState.sideToMove
        fen += ' '
        fen += gameState.castleRights == null ? '-' : gameState.castleRights;
        fen += ' '
        fen += gameState.enPassantTarget == null ? '-' : gameState.enPassantTarget;
        fen += ' '
        fen += gameState.halfMoveClock
        fen += ' '
        fen += gameState.fullMoveCounter

        console.log(fen);

        return fen;
    }


}