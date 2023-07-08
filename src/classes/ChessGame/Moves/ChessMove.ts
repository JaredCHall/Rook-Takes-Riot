import ChessPiece from "../ChessPiece";
import MoveStep from "./MoveStep";
import StateMutation from "../GameState/StateMutation";
import GameState from "../GameState/GameState";
import CastlingMove from "./CastlingMove";

/**
 * This represents any full chess move
 */
export default class ChessMove {

    oldSquare: string

    newSquare: string

    movingPiece: ChessPiece

    capturedPiece: ChessPiece|null

    gameStateMutations: StateMutation[]|null = null // stores enpassant and castling right mutations, so they can be easily reversed

    constructor(oldSquare: string, newSquare:string, movingPiece: ChessPiece, capturedPiece: ChessPiece|null = null) {
        this.oldSquare = oldSquare
        this.newSquare = newSquare
        this.movingPiece = movingPiece
        this.capturedPiece = capturedPiece
    }


    getGameStateMutations(gameState: GameState): StateMutation[] {

        if(this.gameStateMutations !== null){
            return this.gameStateMutations
        }

        const mutations = []

        const castleRightsMutation = this.#getCastleRightsMutation(gameState)
        const enPassantExpiredMutation = this.#getEnPassantExpiredMutation(gameState)

        if(castleRightsMutation){
            mutations.push(castleRightsMutation)
        }
        if(enPassantExpiredMutation){
            mutations.push(enPassantExpiredMutation)
        }

        return this.gameStateMutations = mutations
    }

    #getEnPassantExpiredMutation(gameState: GameState): null|StateMutation
    {
        if(!gameState.enPassantTarget){
            return null
        }

        return new StateMutation('enPassantTarget',gameState.enPassantTarget, null)

    }
    #getCastleRightsMutation(gameState: GameState): null|StateMutation
    {
        if(!gameState.castleRights){
            return null
        }

        if(this.movingPiece.startingSquare != this.oldSquare){
            return null
        }

        const castleRights = this.movingPiece.getCastleRights()
        if(castleRights.length === 0){
            return null
        }

        let newCastleRights = gameState.castleRights
        for(let i = 0; i<castleRights.length; i++){
            newCastleRights = newCastleRights.replace(castleRights[i],'')
        }

        return new StateMutation('castleRights', gameState.castleRights, newCastleRights)
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