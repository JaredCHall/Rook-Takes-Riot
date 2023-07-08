import ChessPiece from "../ChessPiece";
import ChessMove from "./ChessMove";
import MoveStep from "./MoveStep";
export default class EnPassantMove extends ChessMove
{
    capturedPiece: ChessPiece

    constructor(oldSquare: string, newSquare:string, movingPiece: ChessPiece, capturedPiece: ChessPiece) {
        super(oldSquare, newSquare, movingPiece, capturedPiece)
        this.capturedPiece = capturedPiece
    }

    static getOpponentPawnSquare(move: ChessMove): string
    {
        // @ts-ignore
        const newFile = move.newSquare.split('')[0]
        // @ts-ignore
        const startingRank = move.oldSquare.split('')[1]

        return newFile + startingRank
    }

    getMoveSteps(): Array<MoveStep>
    {
        let steps = super.getMoveSteps();
        steps.push(new MoveStep(this.capturedPiece.currentSquare, null))

        return steps
    }

    getUndoSteps(): Array<MoveStep> {
        return [
            new MoveStep(this.capturedPiece.currentSquare, this.capturedPiece),
            new MoveStep(this.oldSquare, this.movingPiece),
            new MoveStep(this.newSquare, null),
        ]
    }
}