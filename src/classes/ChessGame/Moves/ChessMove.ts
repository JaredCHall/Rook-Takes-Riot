import ChessPiece from "../ChessPiece";
import MoveStep from "./MoveStep";


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

    clone(): ChessMove
    {
        const movingPiece = this.movingPiece.clone()
        const capturedPiece = this.capturedPiece ? this.capturedPiece.clone() : null
        return new ChessMove(this.oldSquare, this.newSquare, movingPiece, capturedPiece)
    }

}