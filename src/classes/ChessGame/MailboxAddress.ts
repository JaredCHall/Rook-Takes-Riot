import ChessPiece from "./ChessPiece";
import BoardSquares from "./BoardSquares";
import Mailbox144 from "./Mailbox144";

export default class MailboxAddress
{
    address: number;

    isOutOfBounds: boolean;

    squareName: string;

    piece: ChessPiece|null;


    constructor(address:number, isOutOfBounds: boolean, piece:ChessPiece|null) {
        this.address = address
        this.isOutOfBounds = isOutOfBounds
        this.piece = piece
        this.squareName = Mailbox144.getAddressName(address) ?? 'Out-Of-Bounds'
    }

}