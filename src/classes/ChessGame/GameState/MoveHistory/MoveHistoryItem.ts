import ChessMove from "../../Moves/ChessMove";
import FenNumber from "../FenNumber";
import GameState from "../GameState";

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
}