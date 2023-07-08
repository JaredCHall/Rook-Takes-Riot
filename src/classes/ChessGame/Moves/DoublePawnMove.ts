
import ChessPiece from "../ChessPiece";
import ChessMove from "./ChessMove";
import GameState from "../GameState/GameState";
import StateMutation from "../GameState/StateMutation";
export default class DoublePawnMove extends ChessMove
{

    constructor(oldSquare: string, newSquare:string, movingPiece: ChessPiece) {
        super(oldSquare, newSquare, movingPiece, null)
    }

    getEnPassantTargetSquare(): string
    {
        if(this.newSquare === null){
            throw new Error('this.newSquare is null')
        }

        if(this.movingPiece === null){
            throw new Error('this.piece is null')
        }

        const isWhiteMoving = this.movingPiece.color == 'white'
        const newSquareChars = this.newSquare.split('')

        // target square is one square back from the new square
        const targetRank = parseInt(newSquareChars[1]) - (isWhiteMoving ? 1 : -1)
        const file = newSquareChars[0];
        return file + targetRank.toString()
    }

    getGameStateMutations(gameState: GameState): StateMutation[] {
        return [
            new StateMutation('enPassantTarget', gameState.enPassantTarget, this.getEnPassantTargetSquare())
        ]
    }
}