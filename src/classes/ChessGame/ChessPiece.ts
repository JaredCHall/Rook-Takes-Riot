
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

    /**
     * Get castling rights associated with a piece
     */
    getCastleRights(): string[] {
        if(this.type === 'rook'){
            switch(this.startingSquare){
                case 'a1': return ['Q']
                case 'h1': return ['K']
                case 'a8': return ['q']
                case 'h8': return ['k']
            }
        }

        if(this.type === 'king'){
            switch(this.startingSquare){
                case 'e1': return ['K','Q']
                case 'e8': return ['k','q']
            }
        }
        return []
    }

}