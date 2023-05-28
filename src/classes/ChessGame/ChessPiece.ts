import Mailbox144 from "./Mailbox144";
import MailboxAddress from "./MailboxAddress";

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

    getPawnMoves(pieceIndex: number, mailbox: Mailbox144): Array<string>
    {

        const pieceAddress = mailbox.get(pieceIndex)

        let moves = [];
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
            if(testSquare.piece && testSquare.piece.color != this.color){
                moves.push(testSquare.squareName)
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
            moves.push(testSquare.squareName)
        }

        return moves
    }

    getKnightMoves(pieceIndex: number, mailbox: Mailbox144): Array<string>
    {
        let moves = []
        const moveOffsets = [10, 14, 23, 25, -10, -14, -23, -25]

        for(let i = 0; i<moveOffsets.length;i++){
            const offset = moveOffsets[i]
            const newIndex = pieceIndex + offset
            const testSquare: MailboxAddress = mailbox.get(newIndex)
            // test if square is not out-of-bounds and is either empty or occupied by an enemy piece

            if(testSquare.squareName === 'a6'){
                console.log(testSquare)
            }

            if(!testSquare.isOutOfBounds && (!testSquare.piece || testSquare.piece.color != this.color) ){
                moves.push(testSquare.squareName)
            }
        }

        return moves

    }

    getRookMoves(pieceIndex: number, mailbox: Mailbox144): Array<string>
    {
        let moves = []
        const rayVectors = [
            [1,0], // right
            [-1,0], // left
            [0,-1], // up
            [0,1], // down
        ]
        return this.getMovesFromRayVectors(pieceIndex, mailbox, rayVectors)
    }

    getBishopMoves(pieceIndex: number, mailbox: Mailbox144): Array<string>
    {
        let moves = []
        const rayVectors = [
            [1,1], // 45%
            [-1,1], // 135%
            [-1,-1], // 225%
            [1,-1], // 315%
        ]
        return this.getMovesFromRayVectors(pieceIndex, mailbox, rayVectors)
    }

    getQueenMoves(pieceIndex: number, mailbox: Mailbox144): Array<string>
    {
        let moves = []
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

    getKingMoves(pieceIndex: number, mailbox: Mailbox144): Array<string>
    {
        let moves = []
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
        return this.getMovesFromRayVectors(pieceIndex, mailbox, rayVectors, 1)
    }


    getMovesFromRayVectors(pieceIndex:number, mailbox: Mailbox144, rayVectors: number[][], maxRayLength: number = 7): string[]
    {
        let moves = []

        for(let i = 0; i<rayVectors.length;i++) {
            const vector = rayVectors[i]

            // the maximum possible moves along a ray from any position is 7, except for the king who can only move 1
            for(let j=1;j<=maxRayLength;j++){
                const newIndex = pieceIndex + j * (vector[0] + vector[1] * 12)
                const testSquare: MailboxAddress = mailbox.get(newIndex)

                // if test square is out-of-bounds or occupied by a friendly piece, the ray is terminated
                if(testSquare.isOutOfBounds || (testSquare.piece && testSquare.piece.color == this.color)){
                    break;
                }

                moves.push(testSquare.squareName)

                // if there's an enemy piece, the ray is terminated
                if(testSquare.piece){
                    break;
                }

            }
        }

        return moves

    }


    getMoves(pieceIndex: number, mailbox: Mailbox144): Array<string> {
        switch(this.type){
            case 'pawn': return this.getPawnMoves(pieceIndex, mailbox)
            case 'rook': return this.getRookMoves(pieceIndex, mailbox)
            case 'knight': return this.getKnightMoves(pieceIndex, mailbox)
            case 'bishop': return this.getBishopMoves(pieceIndex, mailbox)
            case 'queen': return this.getQueenMoves(pieceIndex, mailbox)
            case 'king': return this.getKingMoves(pieceIndex, mailbox)
        }
        return []
    }
}