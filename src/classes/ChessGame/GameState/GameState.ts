import FenParser from "./FenParser";
import Mailbox144 from "./Mailbox144";
import ChessMove from "../Moves/ChessMove";
import StateMutation from "./StateMutation";
import MoveList from "../Moves/MoveList";
import MoveHistory from "./MoveHistory";

export default class GameState {

    moveHistory: MoveHistory

    mailbox144: Mailbox144

    fen: string

    sideToMove: string

    castleRights: string|null

    enPassantTarget: string|null

    halfMoveClock: number

    fullMoveCounter: number

    constructor(fen: string|null) {

        this.moveHistory = new MoveHistory()

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

    applyStateMutation(mutation: StateMutation)
    {
        console.log(mutation)
        if(mutation.propertyName === 'enPassantTarget'){
            this.enPassantTarget = mutation.newValue

            return
        }

        if(mutation.propertyName === 'castleRights'){
            this.castleRights = mutation.newValue

            return
        }
    }

    undoStateMutation(mutation: StateMutation)
    {
        if(mutation.propertyName === 'enPassantTarget'){
            this.enPassantTarget = mutation.oldValue

            return
        }

        if(mutation.propertyName === 'castleRights'){
            this.castleRights = mutation.oldValue

            return
        }
    }

    recordMove(chessMove: ChessMove): void {

        const whiteIsMoving = this.sideToMove == 'w';

        const mutations = chessMove.getGameStateMutations(this)
        for(let i=0;i<mutations.length;i++){
            this.applyStateMutation(mutations[i])
        }

        this.mailbox144.makeMove(chessMove)
        this.moveHistory.add(chessMove)

        // change sides and update clock
        this.sideToMove = whiteIsMoving ? 'b' : 'w';

        // update the move counters
        this.halfMoveClock++;
        this.fullMoveCounter = 1 + Math.floor(this.halfMoveClock / 2);

        this.generateFen();

        console.log(this.moveHistory)
    }

    undoLastMove(): void {
        if(this.moveHistory.isEmpty()){
            return
        }

        const lastMove = this.moveHistory.pop()

        const mutations = lastMove.getGameStateMutations(this)
        for(let i=0;i<mutations.length;i++){
            this.undoStateMutation(mutations[i])
        }

        this.mailbox144.undoMove(lastMove)
    }

}