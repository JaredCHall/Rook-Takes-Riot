import MailboxAddress from "./MailboxAddress";
import ChessPiece from "../ChessPiece";
import PiecePositions from "./PiecePositions";
import PieceList from "./PieceList";
import BasicMove from "../Moves/BasicMove";

export default class Mailbox144 {
    board: Array<MailboxAddress>=[];

    piecePositions: PiecePositions = {}; // parallel object that stays updated with the mailboxes

    whitePieces: PieceList

    blackPieces: PieceList

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

    constructor(piecePositions: PiecePositions) {
        this.piecePositions = piecePositions
        this.whitePieces = new PieceList()
        this.blackPieces = new PieceList()
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

        for(let i = 0; i < seed.length; i++){
            const squareName = Mailbox144.getAddressName(i)
            const isOutOfBounds = seed[i] == 'x'
            const piece = !isOutOfBounds ? positions[squareName] : null
            const address = new MailboxAddress(i, isOutOfBounds , piece)
            this.board[i] = address

            if(piece !== null){
                if(piece.color === 'white'){
                    this.whitePieces.add(piece)
                }else{
                    this.blackPieces.add(piece)
                }
            }
        }

        console.log(this.board)
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
    }

    makeMove(move: BasicMove){

        const movingPiece = move.piece

        // check if something is being captured
        let capturedPiece = null
        if(move.newSquare === null){

        }

        // remove piece from old square, except for pawn promotions
        if(move.oldSquare !== move.newSquare){
            this.setSquare(move.oldSquare, null)
        }

        // put the piece on the new square
        if(move.newSquare !== null){
            this.setSquare(move.newSquare, movingPiece)
        }

        if(movingPiece === null){
            return
        }




    }

}