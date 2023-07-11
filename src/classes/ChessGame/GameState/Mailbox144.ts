import MailboxAddress from "./MailboxAddress";
import ChessPiece from "../ChessPiece";
import PiecePositions from "./PiecePositions";
import PieceList from "./PieceList";
import ChessMove from "../Moves/ChessMove";
import MoveList from "../Moves/MoveList";
import MoveFactory from "./MoveFactory";
import GameState from "./GameState";
import FenNumber from "./FenNumber";
import CastlingMove from "../Moves/CastlingMove";
import PawnPromotionMove from "../Moves/PawnPromotionMove";

export default class Mailbox144 {

    moveFactory: MoveFactory

    fenNumber: FenNumber

    board: Array<MailboxAddress>=[];

    piecePositions: PiecePositions = {}; // parallel object that stays updated with the mailboxes

    pieceList: PieceList

    static addressesByIndex: {[index:number]: string} = {
        26: 'a8', 27: 'b8', 28: 'c8', 29: 'd8', 30: 'e8', 31: 'f8', 32: 'g8', 33: 'h8', // rank 8
        38: 'a7', 39: 'b7', 40: 'c7', 41: 'd7', 42: 'e7', 43: 'f7', 44: 'g7', 45: 'h7', // rank 7
        50: 'a6', 51: 'b6', 52: 'c6', 53: 'd6', 54: 'e6', 55: 'f6', 56: 'g6', 57: 'h6', // rank 6
        62: 'a5', 63: 'b5', 64: 'c5', 65: 'd5', 66: 'e5', 67: 'f5', 68: 'g5', 69: 'h5', // rank 5
        74: 'a4', 75: 'b4', 76: 'c4', 77: 'd4', 78: 'e4', 79: 'f4', 80: 'g4', 81: 'h4', // rank 4
        86: 'a3', 87: 'b3', 88: 'c3', 89: 'd3', 90: 'e3', 91: 'f3', 92: 'g3', 93: 'h3', // rank 3
        98: 'a2', 99: 'b2', 100: 'c2', 101: 'd2', 102: 'e2', 103: 'f2', 104: 'g2', 105: 'h2', // rank 2
        110: 'a1', 111: 'b1', 112: 'c1', 113: 'd1', 114: 'e1', 115: 'f1', 116: 'g1', 117: 'h1', // rank 1
    }

    static addressesBySquare: {[name: string]: number};

    static {
        // flip keys and values of the addressesByIndex property
        Mailbox144.addressesBySquare = Object.fromEntries(Object.entries(this.addressesByIndex).map(([key, value]) => [value, parseInt(key)]))

    }

    constructor(fenNumber: FenNumber) {
        this.fenNumber = fenNumber
        this.moveFactory = new MoveFactory(this)
        this.piecePositions = fenNumber.parsePiecePlacements()
        this.pieceList = new PieceList()
        this.initializeBoard(this.piecePositions)
    }

    initializeBoard(positions: PiecePositions): void {
        const seed = [
            'x', 'x',  'x',  'x',  'x',  'x',  'x',  'x',  'x',  'x', 'x', 'x',
            'x', 'x',  'x',  'x',  'x',  'x',  'x',  'x',  'x',  'x', 'x', 'x',
            'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 8
            'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 7
            'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 6
            'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 5
            'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 4
            'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 3
            'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 2
            'x', 'x', null, null, null, null, null, null, null, null, 'x', 'x', // rank 1
            'x', 'x',  'x',  'x',  'x',  'x',  'x',  'x',  'x',  'x', 'x', 'x',
            'x', 'x',  'x',  'x',  'x',  'x',  'x',  'x',  'x',  'x', 'x', 'x',
        ];

        this.pieceList = new PieceList() // clear out piece list
        for(let i = 0; i < seed.length; i++){
            const squareName = Mailbox144.getAddressName(i)
            const isOutOfBounds = seed[i] == 'x'
            const piece = !isOutOfBounds ? positions[squareName] : null
            this.board[i] = new MailboxAddress(i, isOutOfBounds , piece)

            if(piece !== null){
                this.pieceList.add(piece)
            }
        }
    }

    static getAddressName(index: number): string {
        return Mailbox144.addressesByIndex[index] ?? null
    }

    static getAddressIndex(name: string): number {
        return Mailbox144.addressesBySquare[name]
    }
    
    getAddress(address: number): MailboxAddress{
        return this.board[address]
    }

    getSquare(squareName: string): MailboxAddress {
        return this.getAddress(Mailbox144.getAddressIndex(squareName))
    }
    
    setAddress(squareIndex: number, isOutOfBounds: boolean, piece: ChessPiece|null) {

        this.board[squareIndex] = new MailboxAddress(squareIndex, isOutOfBounds, piece)
        const squareName = Mailbox144.getAddressName(squareIndex)
        if(squareName !== null){
            this.piecePositions[squareName] = piece;
        }
    }

    setSquare(squareName: string, piece: ChessPiece|null): void {
        const index = Mailbox144.getAddressIndex(squareName)
        this.setAddress(index, false, piece)
        if(piece !== null){
            piece.currentSquare = squareName
        }
    }

    makeMove(move: ChessMove, validateMated: boolean = true): FenNumber {

        // handle promotion
        if(move instanceof PawnPromotionMove){
            move.movingPiece.promoteTo('queen')
        }

        // execute each move step
        const moveSteps = move.getMoveSteps()
        for(let i = 0; i < moveSteps.length; i++){
            const step = moveSteps[i]
            this.setSquare(step.squareName, step.piece)
        }

        // handle captured pieces
        if(move.capturedPiece){
            this.pieceList.remove(move.capturedPiece)
        }

        const opponentColor = this.getOppositeColor(move.movingPiece.color)
        const fenAfter = FenNumber.fromMailbox(this).incrementTurn(move)

        let isKingMated: boolean = false
        const isKingChecked = this.isKingChecked(opponentColor, fenAfter)
        if(isKingChecked && validateMated){
            console.log('checking for mate')
            isKingMated = this.isKingMated(opponentColor, fenAfter)
        }
        if(isKingChecked){
            fenAfter.setKingIsChecked(this.pieceList.getKing(opponentColor).currentSquare, isKingMated)
            console.log('CHECK!!')
            if(fenAfter.isCheckMate){
                console.log('AND MATE!!')
            }
        }

        return this.fenNumber = fenAfter
    }

    undoMove(move: ChessMove, fenAfter: FenNumber): void
    {

        if(move instanceof PawnPromotionMove){
            move.movingPiece.type = 'pawn'
        }

        // execute each undo step
        const undoSteps = move.getUndoSteps()
        for(let i = 0; i < undoSteps.length; i++){
            const step = undoSteps[i]
            this.setSquare(step.squareName, step.piece)
        }

        // add the captured piece back to the board
        if(move.capturedPiece){
            this.pieceList.add(move.capturedPiece) // add captured piece back to the list of pieces
        }


        this.fenNumber = fenAfter
    }

    getOppositeColor(color:string): string {
        return color === 'white' ? 'black' : 'white'
    }


    isSquareThreatenedBy(square: string, color: string, fenNumber: FenNumber|null = null): boolean
    {
        fenNumber ??= this.fenNumber
        const pieces = this.pieceList.getPieces(color)

        for(const i in pieces){
            const pieceMoves = this.moveFactory.getPseudoLegalMoves(pieces[i].currentSquare, fenNumber)
            if(pieceMoves.hasOwnProperty(square)){
                return true
            }
        }

        return false
    }

    getPseudoLegalMovesForColor(color:string,fenNumber: FenNumber|null = null): ChessMove[]
    {
        fenNumber ??= this.fenNumber
        const pieces = this.pieceList.getPieces(color)

        const moves: ChessMove[] = []
        for(const i in pieces){
            const pieceMoves = this.moveFactory.getPseudoLegalMoves(pieces[i].currentSquare, fenNumber)
            for(const j in pieceMoves){
                moves.push(pieceMoves[j])
            }
        }
        return moves
    }

    isKingChecked(color: string, fenNumber: FenNumber|null = null): boolean
    {
        let isKingChecked = false
        fenNumber = fenNumber ?? this.fenNumber
        const king = this.pieceList.getKing(color)
        const mailbox = new Mailbox144(fenNumber.clone()) // get a new mailbox so we dont mess up the current one

        return mailbox.isSquareThreatenedBy(king.currentSquare, this.getOppositeColor(color), fenNumber)
    }

    isKingMated(color: string, fenNumber: FenNumber): boolean
    {
        const kingSquare = this.pieceList.getKing(color).currentSquare
        const moves = this.getPseudoLegalMovesForColor(color, fenNumber)

        const mailbox = new Mailbox144(fenNumber.clone()) // get a new mailbox so we dont mess up the current one

        // all possible moves are checks, if king is mated
        return moves.reduce(function(isMated: boolean, move:ChessMove) {
            if(!isMated){
                return false
            }
            if(move instanceof CastlingMove){
                // cannot castle away from check
                return true
            }

            console.log(mailbox)

            const moveIsCheck = mailbox.makeMove(move, false).isCheck // must pass false or forever loop
            mailbox.undoMove(move, fenNumber)

            console.log(moveIsCheck)

            return !moveIsCheck // any move that is not a check, sets isMated to true
        }, true)

    }

}