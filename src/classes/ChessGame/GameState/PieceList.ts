import MailboxAddress from "./MailboxAddress";
import ChessPiece from "../ChessPiece";


interface PieceSet {
    king: ChessPiece|null,
    queen: ChessPiece[],
    rook: ChessPiece[],
    knight: ChessPiece[],
    bishop: ChessPiece[],
    pawn: ChessPiece[],
}

export default class PieceList {

    whitePieces: PieceSet = {
        king: null,
        queen: [],
        rook: [],
        knight: [],
        bishop: [],
        pawn: [],
    }

    blackPieces: PieceSet = {
        king: null,
        queen: [],
        rook: [],
        knight: [],
        bishop: [],
        pawn: [],
    }

    add(piece: ChessPiece){
        const list = this.#getListForColor(piece.color)

        if(piece.type === 'king'){
            list.king = piece

            return
        }

        //@ts-ignore
        list[piece.type].push(piece)
    }

    remove(piece: ChessPiece){
        const pieceSet = this.#getListForColor(piece.color)

        if(piece.type === 'king'){
            pieceSet.king = null

            return
        }

        //@ts-ignore
        const pieceList = pieceSet[piece.type]

        for(let i = 0; i < pieceList.length; i++){
            if(piece === pieceList[i]){
                pieceList.splice(i,1)
            }
        }
    }

    getPieces(color: string, type: string|null = null): ChessPiece[]
    {
        const pieceSet = this.#getListForColor(color)

        if(type === null){
            return this.#getAllPiecesForColor(color)
        }

        if(type === 'king'){
            return pieceSet.king ? [pieceSet.king] : []
        }

        // @ts-ignore
        return pieceSet[type]
    }

    #getAllPiecesForColor(color: string): ChessPiece[]{
        const pieceSet = this.#getListForColor(color)

        if(pieceSet.king === null){
            throw new Error(color+' does not have a king!')
        }

        let pieces = []
        pieces.push(pieceSet.king)
        pieces = pieces.concat(
            pieceSet.queen,
            pieceSet.rook,
            pieceSet.knight,
            pieceSet.bishop,
            pieceSet.pawn,
        )

        return pieces
    }

    #getListForColor(color: string): PieceSet {
        return color === 'white' ? this.whitePieces : this.blackPieces
    }

}
