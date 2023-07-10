
import ChessPiece from "../ChessPiece";
import ChessMove from "./ChessMove";
import MoveStep from "./MoveStep";
export default class CastlingMove extends ChessMove
{
    static KING_SIDE_WHITE: 'K' = 'K'
    static QUEEN_SIDE_WHITE: 'Q' = 'Q'
    static KING_SIDE_BLACK: 'k' = 'k'
    static QUEEN_SIDE_BLACK: 'q' = 'q'

    rook: ChessPiece

    castlesType: 'K'|'Q'|'k'|'q'

    static castlesTypesInfo = {
        'Q' : {
            rooksOldSquare: 'a1',
            rooksNewSquare: 'd1',
            kingsOldSquare: 'e1',
            kingsNewSquare: 'c1',
            squaresThatMustBeEmpty: ['d1','c1','b1'],
            squaresThatMustBeSafe: ['e1','d1','c1'],
        },
        'K' : {
            rooksOldSquare: 'h1',
            rooksNewSquare: 'f1',
            kingsOldSquare: 'e1',
            kingsNewSquare: 'g1',
            squaresThatMustBeEmpty: ['f1','g1'],
            squaresThatMustBeSafe: ['e1','f1','g1'],
        },
        'q' : {
            rooksOldSquare: 'a8',
            rooksNewSquare: 'd8',
            kingsOldSquare: 'e8',
            kingsNewSquare: 'c8',
            squaresThatMustBeEmpty: ['d8','c8','b8'],
            squaresThatMustBeSafe: ['e8','d8','c8'],
        },
        'k' : {
            rooksOldSquare: 'h8',
            rooksNewSquare: 'f8',
            kingsOldSquare: 'e8',
            kingsNewSquare: 'g8',
            squaresThatMustBeEmpty: ['f8','g8'],
            squaresThatMustBeSafe: ['e8','f8','g8'],
        }
    }


    constructor(oldSquare: string, newSquare:string, movingPiece: ChessPiece, rook: ChessPiece, castlesType: 'K'|'Q'|'k'|'q') {
        super(oldSquare, newSquare, movingPiece, null)
        this.castlesType = castlesType
        this.rook = rook
    }

    toAlgebraicNotation(): string {
        switch(this.castlesType){
            case 'K':
            case 'k':
                return 'O-O'
            default:
                return 'O-O-O'
        }
    }

    getMoveInfo(): {
        rooksOldSquare: string,
        rooksNewSquare: string,
        kingsOldSquare: string,
        kingsNewSquare: string,
        squaresThatMustBeEmpty: string[],
        squaresThatMustBeSafe: string[]
    } {
        return CastlingMove.castlesTypesInfo[this.castlesType]
    }

    getMoveSteps(): Array<MoveStep> {
        const steps = super.getMoveSteps()
        const rookMoveSteps = this.getRookMove().getMoveSteps()

        return steps.concat(rookMoveSteps)
    }

    getUndoSteps(): Array<MoveStep> {
        const kingUndoSteps = super.getUndoSteps();
        const rookUndoSteps = this.getRookMove().getUndoSteps()

        return kingUndoSteps.concat(rookUndoSteps)
    }

    getRookMove(): ChessMove
    {
        const moveInfo = CastlingMove.castlesTypesInfo[this.castlesType]
        return new ChessMove(moveInfo.rooksOldSquare, moveInfo.rooksNewSquare, this.rook)
    }

}