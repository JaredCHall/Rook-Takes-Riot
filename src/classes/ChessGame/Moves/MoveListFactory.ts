import GameState from "../GameState/GameState";
import MoveList from "./MoveList";
import Mailbox144 from "../GameState/Mailbox144";
import MailboxAddress from "../GameState/MailboxAddress";
import BasicMove from "./BasicMove";
import EnPassantMove from "./EnPassantMove";
import DoublePawnMove from "./DoublePawnMove";
import CastlingMove from "./CastlingMove";
import ChessPiece from "../ChessPiece";

export default class MoveListFactory {

    gameState: GameState

    mailbox144: Mailbox144

    constructor(gameState: GameState) {
        this.gameState = gameState
        this.mailbox144 = gameState.mailbox144
    }

    getLegalMoves(squareName: string): MoveList {
        const mailbox = this.gameState.mailbox144
        const piece = mailbox.getSquare(squareName).piece
        if(piece === null){
            throw new Error('No piece on square '+squareName)
        }

        switch(piece.type){
            case 'pawn': return this.getPawnMoves(piece, squareName)
            case 'rook': return this.getRookMoves(piece, squareName)
            case 'knight': return this.getKnightMoves(piece, squareName)
            case 'bishop': return this.getBishopMoves(piece, squareName)
            case 'queen': return this.getQueenMoves(piece, squareName)
            case 'king': return this.getKingMoves(piece, squareName)
        }
        return {}
    }


    getPawnMoves(piece: ChessPiece, squareName: string): MoveList
    {
        const squareIndex = Mailbox144.getAddressIndex(squareName)
        const pieceAddress = this.mailbox144.getAddress(squareIndex)

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
            const testSquare: MailboxAddress = this.mailbox144.getAddress(newIndex)
            // test if square has an enemy piece
            const move = new BasicMove(pieceAddress.squareName, testSquare.squareName, pieceAddress.piece);
            if(testSquare.piece && testSquare.piece.color != piece.color){
                moves[testSquare.squareName] = move;
            }else if(testSquare.squareName === this.gameState.enPassantTarget){
                moves[testSquare.squareName] = new EnPassantMove(move);
            }
        }

        // test if pawn can move forward
        for(let i = 0; i<moveOffsets.length;i++){
            const offset = moveOffsets[i]
            const newIndex = squareIndex + sign * offset
            const testSquare: MailboxAddress = this.mailbox144.getAddress(newIndex)

            // if out-of-bounds or occupied, stop trying to move forward
            if(testSquare.piece || testSquare.isOutOfBounds){
                break;
            }

            let move = new BasicMove(pieceAddress.squareName, testSquare.squareName, pieceAddress.piece)

            if(i === 1){
                move = new DoublePawnMove(move);
            }
            moves[testSquare.squareName] = move;
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
            const testSquare: MailboxAddress = this.mailbox144.getAddress(newIndex)

            // test if square is not out-of-bounds and is either empty or occupied by an enemy piece
            if(!testSquare.isOutOfBounds && (!testSquare.piece || testSquare.piece.color != piece.color) ){
                moves[testSquare.squareName] = new BasicMove(squareName, testSquare.squareName, piece);
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

    getKingMoves(piece: ChessPiece, squareName: string): MoveList
    {
        const squareIndex = Mailbox144.getAddressIndex(squareName)
        const currentSquare = this.mailbox144.getAddress(squareIndex)
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

        const castleRights = this.gameState.castleRights
        if(castleRights === null){
            return moves // no castle rights, this is a full list of moves
        }

        // get castling moves TODO: find a more elegant way to handle this?
        if(piece.color == 'white' && squareName === 'e1'){

            if(castleRights.indexOf('Q') != -1){
                const a1 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('a1'));
                const b1 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('b1'));
                const c1 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('c1'));
                const d1 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('d1'));

                if(
                    a1.piece != null
                    && a1.piece.type == 'rook'
                    && b1.piece == null
                    && c1.piece == null
                    && d1.piece == null
                ){
                    const basicMove = new BasicMove(currentSquare.squareName, 'c1', currentSquare.piece);
                    moves['c1'] = new CastlingMove(basicMove, a1.piece)
                }
            }

            if(castleRights.indexOf('K') != -1) {
                const h1 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('h1'));
                const g1 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('g1'));
                const f1 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('f1'));

                if (
                    h1.piece != null
                    && h1.piece.type == 'rook'
                    && g1.piece == null
                    && f1.piece == null
                ) {
                    const basicMove = new BasicMove(currentSquare.squareName, 'g1', currentSquare.piece);
                    moves['g1'] = new CastlingMove(basicMove, h1.piece)
                }
            }
        }

        if(piece.color == 'black' && squareName === 'e8'){
            if(castleRights.indexOf('q') != -1){
                const a8 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('a8'));
                const b8 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('b8'));
                const c8 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('c8'));
                const d8 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('d8'));

                if(
                    a8.piece != null
                    && a8.piece.type == 'rook'
                    && b8.piece == null
                    && c8.piece == null
                    && d8.piece == null
                ){
                    const basicMove = new BasicMove(currentSquare.squareName, 'c8', currentSquare.piece);
                    moves['c8'] = new CastlingMove(basicMove, a8.piece)
                }
            }

            if(castleRights.indexOf('k') != -1) {
                const h8 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('h8'));
                const g8 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('g8'));
                const f8 = this.mailbox144.getAddress(Mailbox144.getAddressIndex('f8'));

                if (
                    h8.piece != null
                    && h8.piece.type == 'rook'
                    && g8.piece == null
                    && f8.piece == null
                ) {
                    const basicMove = new BasicMove(currentSquare.squareName, 'g8', currentSquare.piece);
                    moves['g8'] = new CastlingMove(basicMove, h8.piece)
                }
            }
        }

        return moves
    }

    getMovesFromRayVectors(squareIndex:number, piece: ChessPiece, rayVectors: number[][], maxRayLength: number = 7): MoveList
    {
        let moves: MoveList = {}
        const currentSquare = this.mailbox144.getAddress(squareIndex)

        for(let i = 0; i<rayVectors.length;i++) {
            const vector = rayVectors[i]

            // the maximum possible moves along a ray from any position is 7, except for the king who can only move 1
            for(let j=1;j<=maxRayLength;j++){
                const newIndex = squareIndex + j * (vector[0] + vector[1] * 12)
                const testSquare: MailboxAddress = this.mailbox144.getAddress(newIndex)
                console.log(newIndex)
                console.log(testSquare)

                // if test square is out-of-bounds or occupied by a friendly piece, the ray is terminated
                if(testSquare.isOutOfBounds || (testSquare.piece && testSquare.piece.color == piece.color)){
                    break
                }

                moves[testSquare.squareName] = new BasicMove(currentSquare.squareName, testSquare.squareName, currentSquare.piece)

                // if there's an enemy piece, the ray is terminated
                if(testSquare.piece){
                    break
                }
            }
        }

        return moves
    }

}