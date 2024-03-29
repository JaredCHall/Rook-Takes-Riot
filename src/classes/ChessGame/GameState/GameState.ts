import Mailbox144 from "./Mailbox144";
import ChessMove from "../Moves/ChessMove";
import MoveList from "../Moves/MoveList";
import MoveHistory from "./MoveHistory/MoveHistory";
import FenNumber from "./FenNumber";
import MoveHistoryItem from "./MoveHistory/MoveHistoryItem";
import PawnPromotionMove from "../Moves/PawnPromotionMove";

export default class GameState {

    moveHistory: MoveHistory

    mailbox144: Mailbox144

    fenNumber: FenNumber

    startFenNumber: FenNumber

    currentMove: MoveHistoryItem|null = null // the move the game state is currently representing (null means the first move has not been played)

    lastMove: MoveHistoryItem|null = null // the last move completed by either player (null means the first move has not been played)

    constructor(fen: string|null) {

        this.moveHistory = new MoveHistory()
        this.fenNumber = new FenNumber(fen ?? FenNumber.getNewGameFen())
        this.startFenNumber = this.fenNumber.clone()

        // init mailbox144
        this.mailbox144 = new Mailbox144(this.fenNumber)
    }

    /**
     *
     * @param moveIndex
     * @return boolean - is the move playable. In other words, is the current move the same as the last played move
     */
    setCurrentMove(moveIndex: number): boolean {

        const selectedMove = this.moveHistory.get(moveIndex)
        const lastMove = this.moveHistory.getLastMove()

        if(selectedMove === null || lastMove === null){
            return true
        }

        const isPlayable = selectedMove === lastMove

        if(selectedMove.fenAfter === undefined){
            throw new Error('selectedMove.fenAfter is undefined')
        }

        this.mailbox144 = new Mailbox144(selectedMove.fenAfter)

        this.fenNumber = selectedMove.fenAfter
        this.currentMove = selectedMove

        return isPlayable
    }

    isWhiteMoving() {
        return this.fenNumber.isWhiteMoving()
    }
    getMoves(squareName: string): MoveList {
        return this.mailbox144.moveFactory.getLegalMoves(squareName);
    }

    makeMove(chessMove: ChessMove): void {

        if(this.currentMove !== this.lastMove){
            throw new Error('Cannot make a move when the board is set to a previous move.')
        }

        if(chessMove instanceof PawnPromotionMove){
            console.log('this is a promotion')
        }

        const newFenNumber = this.mailbox144.makeMove(chessMove)
        const moveRecord = this.moveHistory.recordMove(this, chessMove, newFenNumber)



        this.fenNumber = newFenNumber
        this.currentMove = this.lastMove = moveRecord
    }

    undoLastMove(): ChessMove|null {

        if(this.moveHistory.isEmpty()){
            return null
        }

        if(this.currentMove !== this.lastMove){
            throw new Error('Cannot undo move when the board is set to a previous move.')
        }

        const lastMove = this.moveHistory.pop()

        this.fenNumber = lastMove.fenBefore
        this.mailbox144.undoMove(lastMove.chessMove, this.fenNumber)

        this.currentMove = this.lastMove = this.moveHistory.getLastMove()

        return lastMove.chessMove
    }



}