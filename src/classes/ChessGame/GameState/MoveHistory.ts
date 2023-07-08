import ChessMove from "../Moves/ChessMove";

export default class MoveHistory
{
    moves: ChessMove[] = []

    isEmpty(): boolean {
        return this.moves.length === 0
    }

    get(halfStepIndex: number): ChessMove
    {
        const move = this.moves[halfStepIndex-1] ?? null
        if(!move){
            throw new Error('Move at half step '+halfStepIndex+' does not exist')
        }

        return move
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