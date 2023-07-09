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

    fenBefore: FenNumber|undefined

    fenAfter: FenNumber|undefined

    moveIndex: number|undefined

    constructor(oldSquare: string, newSquare:string, movingPiece: ChessPiece, capturedPiece: ChessPiece|null = null) {
        this.oldSquare = oldSquare
        this.newSquare = newSquare
        this.movingPiece = movingPiece
        this.capturedPiece = capturedPiece
    }

    mutateFenNumber(gameState: GameState): FenNumber {

        this.fenBefore = gameState.fenNumber.clone()
        this.fenAfter = FenNumber.fromGameState(gameState)
        this.moveIndex = gameState.moveHistory.moves.length -1

        this.mutateHalfMoveClock(this.fenAfter)
        this.mutateCastleRights(this.fenAfter)
        this.mutateEnPassantTarget(this.fenAfter)

        return this.fenAfter

    }
    mutateHalfMoveClock(fenNumber: FenNumber): void {
        if(this.movingPiece.type === 'pawn' || this.capturedPiece){
            fenNumber.halfMoveClock = 0
        }else{
            fenNumber.halfMoveClock++
        }
    }

    mutateEnPassantTarget(fenNumber: FenNumber): void
    {
        if(!fenNumber.enPassantTarget){
            return
        }

        fenNumber.enPassantTarget = '-'
    }
    mutateCastleRights(fenNumber: FenNumber): void
    {
        if(!fenNumber.castleRights){
            return
        }

        if(this.movingPiece.startingSquare != this.oldSquare){
            return
        }

        const castleRights = this.movingPiece.getCastleRights()
        for(let i = 0; i<castleRights.length; i++){
            fenNumber.castleRights = fenNumber.castleRights.replace(castleRights[i],'')
        }
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