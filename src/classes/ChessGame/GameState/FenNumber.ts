import PiecePositions from "./PiecePositions";
import ChessPiece from "../ChessPiece";
import GameState from "./GameState";
import ChessMove from "../Moves/ChessMove";
import DoublePawnMove from "../Moves/DoublePawnMove";
import Mailbox144 from "./Mailbox144";

export default class FenNumber {

    piecePlacements: string

    sideToMove: 'white'|'black'

    castleRights: null|string

    enPassantTarget: null|string

    halfMoveClock: number = 0

    fullMoveCounter: number = 1

    checkedKingSquare: string|null = null

    isCheck: boolean = false

    isCheckMate: boolean = false

    constructor(fen: string) {

        const parts = fen.split(' ')



        this.piecePlacements = parts[0]
        this.sideToMove = (parts[1] ?? 'w') === 'w' ? 'white' : 'black'
        this.castleRights = parts[2] ?? null
        this.enPassantTarget = parts[3] ?? null

        if(parts[4]){
            this.halfMoveClock = parseInt(parts[4])
        }

        if(parts[5]){
            this.fullMoveCounter = parseInt(parts[5])
        }

        if(this.castleRights == '-'){
            this.castleRights = null
        }
        if(this.enPassantTarget == '-'){
            this.enPassantTarget = null
        }
    }

    static getNewGameFen(): string {
        return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    }
    static getEmptyBoardFEN(): string {
        return '8/8/8/8/8/8/8/8 w KQkq -'
    }

    setKingIsChecked(kingSquare: string|false, isMate: boolean): void
    {
        if(kingSquare === false){
            this.checkedKingSquare = null
            this.isCheck = false
            this.isCheckMate = false

            return
        }

        this.checkedKingSquare = kingSquare
        this.isCheck = true
        this.isCheckMate = isMate
    }

    toString(): string {
        return [
            this.piecePlacements,
            this.sideToMove.charAt(0),
            this.castleRights == null ? '-' : this.castleRights,
            this.enPassantTarget == null ? '-' : this.enPassantTarget,
            this.halfMoveClock,
            this.fullMoveCounter
        ].join(' ')
    }

    clone(): FenNumber {
        const fen =  new FenNumber(this.toString())
        fen.isCheck = this.isCheck
        fen.isCheckMate = this.isCheckMate
        return fen
    }

    isWhiteMoving() {
        return this.sideToMove === 'white'
    }

    incrementTurn(chessMove: ChessMove): FenNumber
    {
        // change side to move
        const whiteIsMoving = this.isWhiteMoving()
        this.sideToMove = whiteIsMoving ? 'black' : 'white';

        // increment full move counter if black's turn
        if(!whiteIsMoving){
            this.fullMoveCounter++
        }

        // increment or reset half-move clock as required
        if(chessMove.movingPiece.type === 'pawn' || chessMove.capturedPiece){
            this.halfMoveClock = 0
        }else{
            this.halfMoveClock++
        }

        // handle en passant target
        if(chessMove instanceof DoublePawnMove){
            this.enPassantTarget = chessMove.getEnPassantTargetSquare()
        }else{
            this.enPassantTarget = null
        }

        // handle revoking castle rights
        if(!this.castleRights){
            return this // if there are not castle rights, don't try to revoke
        }

        if(chessMove.movingPiece.startingSquare != chessMove.oldSquare){
            return this // castle rights are only revoked when a piece moves off its starting square
        }

        const castleRights = chessMove.movingPiece.getCastleRights()
        for(let i = 0; i<castleRights.length; i++){
            this.castleRights = this.castleRights.replace(castleRights[i],'')
        }

        return this
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

    static fromMailbox(mailbox: Mailbox144): FenNumber
    {
        const fenNumber = mailbox.fenNumber
        const columnNames = ['a','b','c','d','e','f','g','h']
        let emptySquares = 0

        let fen = ''
        for(let row=8;row>=1;row--){
            for(let col =1; col<=8;col++){
                const squareName = columnNames[col - 1] + row.toString()
                const piece = mailbox.piecePositions[squareName]

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
        fen += fenNumber.sideToMove.charAt(0)
        fen += ' '
        fen += fenNumber.castleRights == null ? '-' : fenNumber.castleRights;
        fen += ' '
        fen += fenNumber.enPassantTarget == null ? '-' : fenNumber.enPassantTarget;
        fen += ' '
        fen += fenNumber.halfMoveClock
        fen += ' '
        fen += fenNumber.fullMoveCounter

        return new FenNumber(fen);
    }
}