import Mailbox144 from "./Mailbox144";
import MailboxAddress from "./MailboxAddress";
import BasicMove from "./Moves/BasicMove";
import DoublePawnMove from "./Moves/DoublePawnMove";
import EnPassantMove from "./Moves/EnPassantMove";
import CastlingMove from "./Moves/CastlingMove";
import MoveList from "./Moves/MoveList";

export default class ChessPiece {

    type: string;

    color: string;

    fenType: string;

    static piecesMap: {[key: string]: string} = {
        r: 'rook',
        b: 'bishop',
        n: 'knight',
        q: 'queen',
        k: 'king',
        p: 'pawn'
    }

    constructor(fenType: string){
        this.fenType = fenType;
        this.type = ChessPiece.piecesMap[fenType.toLowerCase()]
        this.color = fenType == fenType.toLowerCase() ? 'black' : 'white'
    }

    // the representation of the piece in a FEN number
    toFen(): string
    {
        return this.fenType
    }

    getPawnMoves(pieceIndex: number, mailbox: Mailbox144, enPassantTarget: string|null): MoveList
    {

        const pieceAddress = mailbox.get(pieceIndex)

        let moves: MoveList = {};
        const sign = this.color == 'white' ? -1 : 1
        const captureOffsets = [11,13]
        let moveOffsets = [12]

        // determine if pawn is on starting square
        const startingRank = parseInt(pieceAddress.squareName.charAt(1))
        const isOnStartingRank = (this.color == 'white' && startingRank == 2) || (this.color == 'black' && startingRank == 7)
        if(isOnStartingRank){
            // pawns on the starting square can potentially move forward 2 squares
            moveOffsets.push(24)
        }


        // test if pawn can capture diagonally
        for(let i = 0; i<captureOffsets.length;i++){
            const offset = captureOffsets[i]
            const newIndex = pieceIndex + sign * offset
            const testSquare: MailboxAddress = mailbox.get(newIndex)
            // test if square has an enemy piece
            const move = new BasicMove(pieceAddress.squareName, testSquare.squareName, pieceAddress.piece);
            if(testSquare.piece && testSquare.piece.color != this.color){
                moves[testSquare.squareName] = move;
            }else if(testSquare.squareName === enPassantTarget){
                moves[testSquare.squareName] = move;
            }
        }

        // test if pawn can move forward
        for(let i = 0; i<moveOffsets.length;i++){
            const offset = moveOffsets[i]
            const newIndex = pieceIndex + sign * offset
            const testSquare: MailboxAddress = mailbox.get(newIndex)

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

    getKnightMoves(pieceIndex: number, mailbox: Mailbox144): MoveList
    {
        let moves: MoveList = {}
        const moveOffsets = [10, 14, 23, 25, -10, -14, -23, -25]
        const currentSquare = mailbox.get(pieceIndex)
        const currentSquareName = currentSquare.squareName
        const piece = currentSquare.piece

        for(let i = 0; i<moveOffsets.length;i++){
            const offset = moveOffsets[i]
            const newIndex = pieceIndex + offset
            const testSquare: MailboxAddress = mailbox.get(newIndex)

            // test if square is not out-of-bounds and is either empty or occupied by an enemy piece
            if(!testSquare.isOutOfBounds && (!testSquare.piece || testSquare.piece.color != this.color) ){
                moves[testSquare.squareName] = new BasicMove(currentSquareName, testSquare.squareName, piece);
            }
        }

        return moves

    }

    getRookMoves(pieceIndex: number, mailbox: Mailbox144): MoveList
    {
        let moves: MoveList = {}
        const rayVectors = [
            [1,0], // right
            [-1,0], // left
            [0,-1], // up
            [0,1], // down
        ]
        return this.getMovesFromRayVectors(pieceIndex, mailbox, rayVectors)
    }

    getBishopMoves(pieceIndex: number, mailbox: Mailbox144): MoveList
    {
        let moves: MoveList = {}
        const rayVectors = [
            [1,1], // 45%
            [-1,1], // 135%
            [-1,-1], // 225%
            [1,-1], // 315%
        ]
        return this.getMovesFromRayVectors(pieceIndex, mailbox, rayVectors)
    }

    getQueenMoves(pieceIndex: number, mailbox: Mailbox144): MoveList
    {
        let moves: MoveList = {}
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
        return this.getMovesFromRayVectors(pieceIndex, mailbox, rayVectors)
    }

    getKingMoves(pieceIndex: number, mailbox: Mailbox144, castleRights:string|null): MoveList
    {
        let moves: MoveList = {}
        const currentSquare = mailbox.get(pieceIndex)
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
        moves = this.getMovesFromRayVectors(pieceIndex, mailbox, rayVectors, 1)

        // no castle rights, this is a full list of moves
        if(castleRights === null){
            return moves
        }

        if(this.color == 'white' && Mailbox144.getAddressName(pieceIndex) === 'e1'){

            if(castleRights.indexOf('Q') != -1){
                const a1 = mailbox.get(Mailbox144.getAddressIndex('a1'));
                const b1 = mailbox.get(Mailbox144.getAddressIndex('b1'));
                const c1 = mailbox.get(Mailbox144.getAddressIndex('c1'));
                const d1 = mailbox.get(Mailbox144.getAddressIndex('d1'));

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
                const h1 = mailbox.get(Mailbox144.getAddressIndex('h1'));
                const g1 = mailbox.get(Mailbox144.getAddressIndex('g1'));
                const f1 = mailbox.get(Mailbox144.getAddressIndex('f1'));

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

        if(this.color == 'black' && Mailbox144.getAddressName(pieceIndex) === 'e8'){
            if(castleRights.indexOf('q') != -1){
                const a8 = mailbox.get(Mailbox144.getAddressIndex('a8'));
                const b8 = mailbox.get(Mailbox144.getAddressIndex('b8'));
                const c8 = mailbox.get(Mailbox144.getAddressIndex('c8'));
                const d8 = mailbox.get(Mailbox144.getAddressIndex('d8'));

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
                const h8 = mailbox.get(Mailbox144.getAddressIndex('h8'));
                const g8 = mailbox.get(Mailbox144.getAddressIndex('g8'));
                const f8 = mailbox.get(Mailbox144.getAddressIndex('f8'));

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




    getMovesFromRayVectors(pieceIndex:number, mailbox: Mailbox144, rayVectors: number[][], maxRayLength: number = 7): MoveList
    {
        let moves: MoveList = {}
        const currentSquare = mailbox.get(pieceIndex)

        for(let i = 0; i<rayVectors.length;i++) {
            const vector = rayVectors[i]

            // the maximum possible moves along a ray from any position is 7, except for the king who can only move 1
            for(let j=1;j<=maxRayLength;j++){
                const newIndex = pieceIndex + j * (vector[0] + vector[1] * 12)
                const testSquare: MailboxAddress = mailbox.get(newIndex)

                // if test square is out-of-bounds or occupied by a friendly piece, the ray is terminated
                if(testSquare.isOutOfBounds || (testSquare.piece && testSquare.piece.color == this.color)){
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


    getMoves(pieceIndex: number, mailbox: Mailbox144, castleRights: string|null, enPassantTarget: string|null): MoveList {
        switch(this.type){
            case 'pawn': return this.getPawnMoves(pieceIndex, mailbox, enPassantTarget)
            case 'rook': return this.getRookMoves(pieceIndex, mailbox)
            case 'knight': return this.getKnightMoves(pieceIndex, mailbox)
            case 'bishop': return this.getBishopMoves(pieceIndex, mailbox)
            case 'queen': return this.getQueenMoves(pieceIndex, mailbox)
            case 'king': return this.getKingMoves(pieceIndex, mailbox, castleRights)
        }
        return {}
    }
}