import ChessMove from "../../Moves/ChessMove";

export default class MoveHistory
{
    moves: ChessMove[] = []

    isEmpty(): boolean {
        return this.moves.length === 0
    }

    // moveIndex starts at zero and is incremented for every half move
    get(moveIndex: number): ChessMove
    {
        const move = this.moves[moveIndex] ?? null
        if(!move){
            throw new Error('Move at half step '+moveIndex+' does not exist')
        }

        return move
    }

    getLastMove(): ChessMove|null
    {
        if(this.moves.length === 0){
            return null
        }

        return this.moves[this.moves.length - 1]
    }

    add(move: ChessMove){
        this.moves.push(move)
    }

    pop(): ChessMove {
        const move = this.moves.pop()
        if(move === undefined){
            throw new Error('nothing to pop')
        }
        return move
    }
}