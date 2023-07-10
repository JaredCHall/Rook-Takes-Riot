import ChessPiece from "../ChessPiece";
import MoveStep from "./MoveStep";
import GameState from "../GameState/GameState";
import FenNumber from "../GameState/FenNumber";

/**
 * This represents any full chess move
 */
export default class ChessMove {

    oldSquare: string

    newSquare: string

    movingPiece: ChessPiece

    capturedPiece: ChessPiece|null

    constructor(oldSquare: string, newSquare:string, movingPiece: ChessPiece, capturedPiece: ChessPiece|null = null) {
        this.oldSquare = oldSquare
        this.newSquare = newSquare
        this.movingPiece = movingPiece
        this.capturedPiece = capturedPiece
    }


    toAlgebraicNotation(): string {
        const isPawn = this.movingPiece.type === 'pawn'
        let moveNotation = isPawn ? '' : this.movingPiece.toFen().toUpperCase()

        if(isPawn && this.capturedPiece){
            moveNotation += this.oldSquare.split('')[0]
        }

        moveNotation += this.capturedPiece ? 'x' : ''
        //moveNotation += isPawn ? '' : this.oldSquare
        moveNotation += this.newSquare

        return moveNotation
    }

    getMoveSteps(): Array<MoveStep>
    {
        return [
            new MoveStep(this.oldSquare, null),
            new MoveStep(this.newSquare, this.movingPiece)
        ]
    }

    getUndoSteps(): Array<MoveStep>
    {
        return [
            new MoveStep(this.newSquare, this.capturedPiece),
            new MoveStep(this.oldSquare, this.movingPiece)
        ]

    }
}