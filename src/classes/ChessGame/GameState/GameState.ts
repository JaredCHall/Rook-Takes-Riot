import Mailbox144 from "./Mailbox144";
import ChessMove from "../Moves/ChessMove";
import MoveList from "../Moves/MoveList";
import MoveHistory from "./MoveHistory/MoveHistory";
import FenNumber from "./FenNumber";

export default class GameState {

    moveHistory: MoveHistory

    mailbox144: Mailbox144

    fenNumber: FenNumber

    fenString: string = ''

    startFenNumber: FenNumber

    currentMove: ChessMove|null = null // the move the game state is currently representing (null means the first move has not been played)

    lastMove: ChessMove|null = null // the last move completed by either player (null means the first move has not been played)

    constructor(fen: string|null) {

        this.moveHistory = new MoveHistory()
        this.fenNumber = new FenNumber(fen ?? GameState.getNewGameFen())
        this.startFenNumber = this.fenNumber.clone()
        this.fenString = this.fenNumber.toString()

        // init mailbox144
        this.mailbox144 = new Mailbox144(this.fenNumber.parsePiecePlacements())
    }

    static getNewGameFen(): string {
        return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
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

        const piecePositions = selectedMove.fenAfter.parsePiecePlacements()

        this.mailbox144 = new Mailbox144(piecePositions)

        this.fenNumber = selectedMove.fenAfter
        this.currentMove = selectedMove

        return isPlayable
    }

    isWhiteMoving() {
        return this.fenNumber.isWhiteMoving()
    }

    makeMove(chessMove: ChessMove): void {

        if(this.currentMove !== this.lastMove){
            throw new Error('Cannot make a move when the board is set to a previous move. Select the latest move to contine the game')
        }

        this.mailbox144.makeMove(chessMove)
        this.moveHistory.add(chessMove)
        this.fenNumber = chessMove.mutateFenNumber(this)
        this.fenNumber.incrementTurn()
        this.currentMove = this.lastMove = chessMove

        console.log(this.moveHistory)
    }

    undoLastMove(): ChessMove|null {

        if(this.moveHistory.isEmpty()){
            return null
        }

        const lastMove = this.moveHistory.pop()
        if(!lastMove.fenBefore){
            throw new Error('fenBefore is undefined for move')
        }

        console.log(lastMove.fenBefore)
        console.log(lastMove.fenAfter)
        this.fenNumber = lastMove.fenBefore
        this.mailbox144.undoMove(lastMove)

        return this.currentMove = this.lastMove = this.moveHistory.getLastMove()
    }

}