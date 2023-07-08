import PiecePositions from "./PiecePositions";
import ChessPiece from "../ChessPiece";
import FenParser from "./FenParser";
import BasicMove from "../Moves/BasicMove";
import CastlingMove from "../Moves/CastlingMove";
import DoublePawnMove from "../Moves/DoublePawnMove";
import Mailbox144 from "./Mailbox144";

export default class GameState {

    fen: string

    mailbox144: Mailbox144

    sideToMove: string

    castleRights: string|null

    enPassantTarget: string|null

    halfMoveClock: number

    fullMoveCounter: number

    constructor(fen: string|null) {

        this.fen = fen ?? GameState.getNewGameFen()

        const parts = this.fen.split(' ')

        // init mailbox144
        const piecePositions = FenParser.parsePiecePlacements(parts[0]);
        this.mailbox144 = new Mailbox144(piecePositions)

        this.sideToMove = parts[1] ?? 'w'
        this.castleRights = parts[2] ?? null
        this.enPassantTarget = parts[3] ?? null
        this.halfMoveClock = parseInt(parts[4]) ?? 0
        this.fullMoveCounter = parseInt(parts[5]) ?? 1

    }

    static getNewGameFen(): string {
        return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    }

    generateFen(): string {
        return this.fen = FenParser.calculateFen(this)
    }

    recordMove(chessMove: BasicMove): void {
        const whiteIsMoving = this.sideToMove == 'w';

        const piece = chessMove.movingPiece
        if(piece === null){
            throw new Error('expected ChessPiece')
        }

        // castles logic
        if(chessMove instanceof CastlingMove || piece.type == 'king'){
            const castleTypes = this.sideToMove == 'w' ? 'KQ' : 'kq'
            this.revokeCastlingRights(castleTypes)
        }
        if(piece.type == 'rook'){
            this.checkRookMoveCastlingRights(chessMove.oldSquare)
        }

        // en passant logic
        this.enPassantTarget = null
        if(chessMove instanceof DoublePawnMove){
            this.enPassantTarget = chessMove.getEnPassantTargetSquare()
        }

        // change sides and update clock
        this.sideToMove = whiteIsMoving ? 'b' : 'w';

        // update the move counters
        this.halfMoveClock++;
        this.fullMoveCounter = 1 + Math.floor(this.halfMoveClock / 2);

        this.generateFen();
    }

    isKingInCheck()
    {

    }


    checkRookMoveCastlingRights(oldSquare: string)
    {
        // if rook is moving from its starting square, then revoke castling rights for that side
        if(this.sideToMove === 'w'){
            if(oldSquare === 'a1'){
                this.revokeCastlingRights('Q')
            }else if(oldSquare == 'h1'){
                this.revokeCastlingRights('K')
            }
        }else{
            if(oldSquare === 'a8'){
                this.revokeCastlingRights('q')
            }else if(oldSquare == 'h8'){
                this.revokeCastlingRights('k')
            }
        }
    }


    revokeCastlingRights(castleTypes: string): void
    {
        if(this.castleRights == null){
            return
        }

        const revocations = castleTypes.split('')

        for(const i in revocations){
            this.castleRights = this.castleRights.replace(revocations[i],'');
        }
        if(this.castleRights === ''){
            this.castleRights = null;
        }
    }

}