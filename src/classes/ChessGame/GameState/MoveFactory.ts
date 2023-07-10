import MoveList from "../Moves/MoveList";
import Mailbox144 from "./Mailbox144";
import MailboxAddress from "./MailboxAddress";
import EnPassantMove from "../Moves/EnPassantMove";
import DoublePawnMove from "../Moves/DoublePawnMove";
import CastlingMove from "../Moves/CastlingMove";
import ChessPiece from "../ChessPiece";
import ChessMove from "../Moves/ChessMove";
import FenNumber from "./FenNumber";

export default class MoveFactory {

    mailbox: Mailbox144

    constructor(mailbox: Mailbox144) {
        this.mailbox = mailbox
    }

    getMailbox(): Mailbox144{
        return this.mailbox
    }

    getMovingPiece(squareName: string): ChessPiece {
        const piece = this.mailbox.getSquare(squareName).piece
        if(piece === null){
            throw new Error('No piece on square '+squareName)
        }
        return piece
    }

    getLegalMoves(squareName: string): MoveList {
        const candidateMoves = this.getPseudoLegalMoves(squareName)
        const movingPiece = this.getMovingPiece(squareName)
        const currentFen = this.mailbox.fenNumber

        const legalMoves: MoveList = {}
        for(const i in candidateMoves){
            const move = candidateMoves[i]

            this.mailbox.makeMove(move)
            if(!this.mailbox.isKingChecked(movingPiece.color)){
                legalMoves[move.newSquare] = move
            }
            this.mailbox.undoMove(move,currentFen)
        }
        return legalMoves
    }

    getPseudoLegalMoves(squareName: string, fenNumber: FenNumber|null = null): MoveList {
        const mailbox = this.getMailbox()
        fenNumber ??= mailbox.fenNumber
        const piece = this.getMovingPiece(squareName)

        switch(piece.type){
            case 'pawn': return this.getPawnMoves(piece, squareName, fenNumber.enPassantTarget)
            case 'rook': return this.getRookMoves(piece, squareName)
            case 'knight': return this.getKnightMoves(piece, squareName)
            case 'bishop': return this.getBishopMoves(piece, squareName)
            case 'queen': return this.getQueenMoves(piece, squareName)
            case 'king': return this.getKingMoves(piece, squareName, fenNumber.castleRights)
        }
        return {}
    }

    getPawnMoves(piece: ChessPiece, squareName: string, enPassantTarget: null|string): MoveList
    {
        const squareIndex = Mailbox144.getAddressIndex(squareName)
        const pieceAddress = this.getMailbox().getAddress(squareIndex)

        let moves: MoveList = {};
        const isPieceWhite = piece.color == 'white'
        const sign = isPieceWhite ? -1 : 1
        const captureOffsets = [11,13]
        let moveOffsets = [12]

        // determine if pawn is on starting square
        const startingRank = parseInt(pieceAddress.squareName.charAt(1))
        const isOnStartingRank = (isPieceWhite && startingRank == 2) || (!isPieceWhite && startingRank == 7)
        if(isOnStartingRank){
            // pawns on the starting square can potentially move forward 2 squares
            moveOffsets.push(24)
        }

        // test if pawn can capture diagonally
        for(let i = 0; i<captureOffsets.length;i++){
            const offset = captureOffsets[i]
            const newIndex = squareIndex + sign * offset
            const testSquare: MailboxAddress = this.getMailbox().getAddress(newIndex)
            // test if square has an enemy piece
            const move = new ChessMove(pieceAddress.squareName, testSquare.squareName, piece, testSquare.piece);
            if(testSquare.piece && testSquare.piece.color != piece.color){
                moves[testSquare.squareName] = move;

            }else if(testSquare.squareName === enPassantTarget){

                // Handle En Passant

                const capturedSquare = EnPassantMove.getOpponentPawnSquare(move)
                const capturedPawn = this.mailbox.getSquare(capturedSquare).piece
                if(capturedPawn !== null){
                    moves[testSquare.squareName] = new EnPassantMove(pieceAddress.squareName, testSquare.squareName, piece, capturedPawn);
                }

            }
        }

        // test if pawn can move forward
        for(let i = 0; i<moveOffsets.length;i++){
            const offset = moveOffsets[i]
            const newIndex = squareIndex + sign * offset
            const testSquare: MailboxAddress = this.getMailbox().getAddress(newIndex)

            // if out-of-bounds or occupied, stop trying to move forward
            if(testSquare.piece || testSquare.isOutOfBounds){
                break;
            }

            if(i === 1){
                moves[testSquare.squareName] = new DoublePawnMove(pieceAddress.squareName, testSquare.squareName, piece);
            }else{
                moves[testSquare.squareName] = new ChessMove(pieceAddress.squareName, testSquare.squareName, piece)
            }
        }

        return moves
    }

    getKnightMoves(piece: ChessPiece, squareName: string): MoveList
    {
        let moves: MoveList = {}
        const moveOffsets = [10, 14, 23, 25, -10, -14, -23, -25]
        const squareIndex = Mailbox144.getAddressIndex(squareName)

        for(let i = 0; i<moveOffsets.length;i++){
            const offset = moveOffsets[i]
            const newIndex = squareIndex + offset
            const testSquare: MailboxAddress = this.getMailbox().getAddress(newIndex)

            let capturedPiece = null
            if(testSquare.piece != null){
                capturedPiece = testSquare.piece
            }


            // test if square is not out-of-bounds and is either empty or occupied by an enemy piece
            if(!testSquare.isOutOfBounds && (!testSquare.piece || testSquare.piece.color != piece.color) ){
                moves[testSquare.squareName] = new ChessMove(squareName, testSquare.squareName, piece, capturedPiece);
            }
        }

        return moves
    }

    getRookMoves(piece: ChessPiece, squareName: string): MoveList
    {
        const squareIndex = Mailbox144.getAddressIndex(squareName)
        const rayVectors = [
            [1,0], // right
            [-1,0], // left
            [0,-1], // up
            [0,1], // down
        ]
        return this.getMovesFromRayVectors(squareIndex, piece, rayVectors)
    }

    getBishopMoves(piece: ChessPiece, squareName: string): MoveList
    {
        const squareIndex = Mailbox144.getAddressIndex(squareName)
        const rayVectors = [
            [1,1], // 45%
            [-1,1], // 135%
            [-1,-1], // 225%
            [1,-1], // 315%
        ]
        return this.getMovesFromRayVectors(squareIndex, piece, rayVectors)
    }

    getQueenMoves(piece: ChessPiece, squareName: string): MoveList
    {
        const squareIndex = Mailbox144.getAddressIndex(squareName)
        const rayVectors = [
            [1,0], // right
            [-1,0], // left
            [0,-1], // up
            [0,1], // down
            [1,1], // 45%
            [-1,1], // 135%
            [-1,-1], // 225%
            [1,-1], // 315%
        ]
        return this.getMovesFromRayVectors(squareIndex, piece, rayVectors)
    }

    getKingMoves(piece: ChessPiece, squareName: string, castleRights: null|string): MoveList
    {
        const squareIndex = Mailbox144.getAddressIndex(squareName)
        const currentSquare = this.getMailbox().getAddress(squareIndex)
        const rayVectors = [
            [1,0], // right
            [-1,0], // left
            [0,-1], // up
            [0,1], // down
            [1,1], // 45%
            [-1,1], // 135%
            [-1,-1], // 225%
            [1,-1], // 315%
        ]
        let moves = this.getMovesFromRayVectors(squareIndex, piece, rayVectors, 1)

        if(castleRights === null){
            return moves // no castle rights, this is a full list of moves
        }

        // get castling moves TODO: find a more elegant way to handle this?
        if(piece.color == 'white' && squareName === 'e1'){

            if(castleRights.indexOf('Q') != -1){
                const a1 = this.getMailbox().getSquare('a1');
                const b1 = this.getMailbox().getSquare('b1');
                const c1 = this.getMailbox().getSquare('c1');
                const d1 = this.getMailbox().getSquare('d1');

                if(
                    a1.piece != null
                    && a1.piece.type == 'rook'
                    && b1.piece == null
                    && c1.piece == null
                    && d1.piece == null
                ){
                    moves['c1'] = new CastlingMove(currentSquare.squareName, 'c1', piece, a1.piece)
                }
            }

            if(castleRights.indexOf('K') != -1) {
                const h1 = this.getMailbox().getSquare('h1');
                const g1 = this.getMailbox().getSquare('g1');
                const f1 = this.getMailbox().getSquare('f1');

                if (
                    h1.piece != null
                    && h1.piece.type == 'rook'
                    && g1.piece == null
                    && f1.piece == null
                ) {
                    moves['g1'] = new CastlingMove(currentSquare.squareName, 'g1', piece, h1.piece)
                }
            }
        }

        if(piece.color == 'black' && squareName === 'e8'){
            if(castleRights.indexOf('q') != -1){
                const a8 = this.getMailbox().getSquare('a8');
                const b8 = this.getMailbox().getSquare('b8');
                const c8 = this.getMailbox().getSquare('c8');
                const d8 = this.getMailbox().getSquare('d8');

                if(
                    a8.piece != null
                    && a8.piece.type == 'rook'
                    && b8.piece == null
                    && c8.piece == null
                    && d8.piece == null
                ){
                    moves['c8'] = new CastlingMove(currentSquare.squareName, 'c8', piece, a8.piece)
                }
            }

            if(castleRights.indexOf('k') != -1) {
                const h8 = this.getMailbox().getSquare('h8');
                const g8 = this.getMailbox().getSquare('g8');
                const f8 = this.getMailbox().getSquare('f8');

                if (
                    h8.piece != null
                    && h8.piece.type == 'rook'
                    && g8.piece == null
                    && f8.piece == null
                ) {
                    moves['g8'] = new CastlingMove(currentSquare.squareName, 'g8',piece, h8.piece)
                }
            }
        }

        return moves
    }

    getMovesFromRayVectors(squareIndex:number, piece: ChessPiece, rayVectors: number[][], maxRayLength: number = 7): MoveList
    {
        let moves: MoveList = {}
        const currentSquare = this.getMailbox().getAddress(squareIndex)

        for(let i = 0; i<rayVectors.length;i++) {
            const vector = rayVectors[i]

            // the maximum possible moves along a ray from any position is 7, except for the king who can only move 1
            for(let j=1;j<=maxRayLength;j++){
                const newIndex = squareIndex + j * (vector[0] + vector[1] * 12)
                const testSquare: MailboxAddress = this.getMailbox().getAddress(newIndex)

                // if test square is out-of-bounds or occupied by a friendly piece, the ray is terminated
                if(testSquare.isOutOfBounds || (testSquare.piece && testSquare.piece.color == piece.color)){
                    break
                }

                let capturedPiece = null
                if(testSquare.piece != null){
                    capturedPiece = testSquare.piece
                }

                moves[testSquare.squareName] = new ChessMove(currentSquare.squareName, testSquare.squareName, piece, capturedPiece)

                // if there's an enemy piece, the ray is terminated
                if(testSquare.piece){
                    break
                }
            }
        }

        return moves
    }

}