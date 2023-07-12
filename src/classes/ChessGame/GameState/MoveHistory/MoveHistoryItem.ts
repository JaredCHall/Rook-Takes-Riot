import ChessMove from "../../Moves/ChessMove";
import FenNumber from "../FenNumber";
import GameState from "../GameState";
import Mailbox144 from "../Mailbox144";
import CastlingMove from "../../Moves/CastlingMove";

export default class MoveHistoryItem {

    chessMove: ChessMove

    moveIndex: number

    fenBefore: FenNumber

    fenAfter: FenNumber

    constructor(gameState: GameState, chessMove: ChessMove, fenAfter: FenNumber) {

        const lastMoveIndex = gameState.moveHistory.getLastMove()?.moveIndex ?? -1

        this.chessMove = chessMove
        this.moveIndex = lastMoveIndex + 1
        this.fenBefore = gameState.fenNumber.clone()
        this.fenAfter = fenAfter.clone()
    }

    toAlgebraicNotation(): string {
        const chessMove = this.chessMove


        if(chessMove instanceof CastlingMove){
            return chessMove.toAlgebraicNotation()
        }

        const isPawn = chessMove.movingPiece.type === 'pawn'
        let moveNotation = isPawn ? '' : chessMove.movingPiece.toFen().toUpperCase()

        if(isPawn && chessMove.capturedPiece){
            moveNotation += chessMove.oldSquare.split('')[0]
        }


        moveNotation += this.determineDisambiguation()

        moveNotation += chessMove.capturedPiece ? 'x' : ''


        moveNotation += chessMove.newSquare

        if(this.fenAfter.isCheckMate){
            moveNotation += '#'
        }else if(this.fenAfter.isCheck){
            moveNotation += '+'
        }

        return moveNotation
    }

    determineDisambiguation(): string{

        const movingPiece = this.chessMove.movingPiece
        const oldSquareRank = this.chessMove.oldSquare.charAt(0)
        const oldSquareFile = this.chessMove.oldSquare.charAt(1)


        const mailbox = new Mailbox144(this.fenBefore.clone());
        const pieces = mailbox.pieceList.getPieces(movingPiece.color, movingPiece.type)

        let attackingFromSquares: string[] = []
        let attackingFromRanks: {[square:string]: number} = {}
        let attackingFromFiles: {[square:string]: number} = {}

        for(const i in pieces){
            const piece = pieces[i]
            const legalMoves = mailbox.moveFactory.getLegalMoves(piece.currentSquare)
            if(legalMoves.hasOwnProperty(this.chessMove.newSquare)){
                attackingFromSquares.push(piece.currentSquare)
                const rank = piece.currentSquare.charAt(0)
                const file = piece.currentSquare.charAt(1)

                if(!attackingFromRanks.hasOwnProperty(rank)){
                    attackingFromRanks[rank] = 0
                }

                if(!attackingFromRanks.hasOwnProperty(file)){
                    attackingFromFiles[file] = 0
                }

                attackingFromRanks[rank]++
                attackingFromFiles[file]++
            }
        }

        if(attackingFromSquares.length === 1){
            return ''
        }

        const rankIsUnique = attackingFromRanks[oldSquareRank] === 1
        const fileIsUnique = attackingFromFiles[oldSquareFile] === 1

        console.log(attackingFromSquares)
        console.log(attackingFromRanks)
        console.log(attackingFromFiles)

        if(rankIsUnique){
            return oldSquareRank
        }

        if(fileIsUnique){
            return oldSquareFile
        }

        return this.chessMove.oldSquare
    }
}