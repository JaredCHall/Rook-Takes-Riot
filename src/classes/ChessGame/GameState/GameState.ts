import Mailbox144 from "./Mailbox144";
import ChessMove from "../Moves/ChessMove";
import MoveList from "../Moves/MoveList";
import MoveHistory from "./MoveHistory";
import FenNumber from "./FenNumber";

export default class GameState {

    moveHistory: MoveHistory

    mailbox144: Mailbox144

    fenNumber: FenNumber

    fenString: string = ''

    startFenNumber: FenNumber

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

    isWhiteMoving() {
        return this.fenNumber.isWhiteMoving()
    }

    makeMove(chessMove: ChessMove): void {

        this.mailbox144.makeMove(chessMove)
        this.moveHistory.add(chessMove)
        this.fenNumber = chessMove.mutateFenNumber(this)
        this.fenNumber.incrementTurn()
        this.fenString = this.fenNumber.toString()

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
        this.fenString = this.fenNumber.toString()
        this.mailbox144.undoMove(lastMove)

        return lastMove
    }

}