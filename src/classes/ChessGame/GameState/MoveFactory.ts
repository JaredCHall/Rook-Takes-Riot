import MoveList from "../Moves/MoveList";
import Mailbox144 from "./Mailbox144";
import MailboxAddress from "./MailboxAddress";
import EnPassantMove from "../Moves/EnPassantMove";
import DoublePawnMove from "../Moves/DoublePawnMove";
import CastlingMove from "../Moves/CastlingMove";
import ChessPiece from "../ChessPiece";
import ChessMove from "../Moves/ChessMove";
import FenNumber from "./FenNumber";
import GameState from "./GameState";

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

        // ensure move does not put the king in check
        const legalMoves: MoveList = {}
        for(const i in candidateMoves){
            const move = candidateMoves[i]

            this.mailbox.makeMove(move)

            let isKingChecked: boolean = false
            if(move instanceof CastlingMove){
                // every square a king passes through, including the old and new square, must be safe in order to castle
                const expectedSafeSquares = move.getMoveInfo().squaresThatMustBeSafe
                isKingChecked = expectedSafeSquares.reduce((isKingChecked, squareName) =>
                        isKingChecked || this.mailbox.isSquareThreatenedBy(squareName, this.mailbox.getOppositeColor(movingPiece.color))
                    , false)
            }else{
                // for every other type of move, you just cannot end a turn with a check on the board
                isKingChecked = this.mailbox.isKingChecked(movingPiece.color)
            }

            if(!isKingChecked){
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
        const mailbox = this.getMailbox()
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

        // get possible castling moves
        let possibleTypes: ('K'|'Q'|'k'|'q')[] = []
        if(piece.color === 'white' && squareName === 'e1'){
            possibleTypes = ['K','Q']
        }else if(piece.color === 'black' && squareName === 'e8'){
            possibleTypes = ['k','q']
        }else{
            // king is not on starting square, castling not possible
            return moves
        }

        // evaluate possible castling moves
        for(const i in possibleTypes){
            const possibleCastlesType = possibleTypes[i]
            if(castleRights.indexOf(possibleCastlesType) === -1){
                continue
            }

            const moveInfo = CastlingMove.castlesTypesInfo[possibleCastlesType]
            const rookSquare = mailbox.getSquare(moveInfo.rooksOldSquare)
            const expectedEmptySquares = moveInfo.squaresThatMustBeEmpty

            // determine if any of the empty squares are occupied
            const isAnyOccupied = expectedEmptySquares.reduce((isAnyOccupied, squareName) =>
                isAnyOccupied || this.mailbox.getSquare(squareName).piece !== null
            , false)

            if(
                rookSquare.piece && rookSquare.piece.type == 'rook' // rook must be in its proper place
                && !isAnyOccupied
            ){
                moves[moveInfo.kingsNewSquare] = new CastlingMove(currentSquare.squareName, moveInfo.kingsNewSquare, piece, rookSquare.piece, possibleCastlesType)
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