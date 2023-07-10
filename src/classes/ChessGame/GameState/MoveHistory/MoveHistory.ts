import ChessMove from "../../Moves/ChessMove";
import MoveHistoryItem from "./MoveHistoryItem";
import GameState from "../GameState";

export default class MoveHistory
{
    moves: MoveHistoryItem[] = []

    isEmpty(): boolean {
        return this.moves.length === 0
    }

    length(): number {
        return this.moves.length
    }

    all(): MoveHistoryItem[] {
        return this.moves
    }

    // moveIndex starts at zero and is incremented for every half move
    get(moveIndex: number): MoveHistoryItem
    {
        const move = this.moves[moveIndex] ?? null
        if(!move){
            throw new Error('Move at half step '+moveIndex+' does not exist')
        }

        return move
    }

    getLastMove(): MoveHistoryItem|null
    {
        if(this.moves.length === 0){
            return null
        }

        return this.moves[this.moves.length - 1]
    }

    recordMove(gameState: GameState, chessMove: ChessMove){
        const moveHistoryItem = new MoveHistoryItem(gameState, chessMove)
        this.moves.push(moveHistoryItem)
        return moveHistoryItem
    }

    add(move: MoveHistoryItem){
        this.moves.push(move)
    }

    pop(): MoveHistoryItem {
        const move = this.moves.pop()
        if(move === undefined){
            throw new Error('nothing to pop')
        }
        return move
    }
}