import Mailbox144 from "./GameState/Mailbox144";
import MailboxAddress from "./GameState/MailboxAddress";
import BasicMove from "./Moves/BasicMove";
import DoublePawnMove from "./Moves/DoublePawnMove";
import EnPassantMove from "./Moves/EnPassantMove";
import CastlingMove from "./Moves/CastlingMove";
import MoveList from "./Moves/MoveList";
import GameState from "./GameState/GameState";

export default class ChessPiece {

    type: string;

    color: string;

    fenType: string;

    startingSquare: string

    currentSquare: string

    static piecesMap: {[key: string]: string} = {
        r: 'rook',
        b: 'bishop',
        n: 'knight',
        q: 'queen',
        k: 'king',
        p: 'pawn'
    }

    constructor(fenType: string, startingSquare: string){
        this.fenType = fenType;
        this.startingSquare = startingSquare
        this.currentSquare = startingSquare
        this.type = ChessPiece.piecesMap[fenType.toLowerCase()]
        this.color = fenType == fenType.toLowerCase() ? 'black' : 'white'
    }

    // the representation of the piece in a FEN number
    toFen(): string
    {
        return this.fenType
    }
}