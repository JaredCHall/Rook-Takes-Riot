export default class ChessGamePosition {

    constructor(fen) {
        this.fen = fen

        // parse the FEN
        // @see https://www.chessprogramming.org/Forsyth-Edwards_Notation
        const parts = fen.split(' ')
        this.piecePlacement = parts[0]
        this.sideToMove = parts[1] ?? null
        this.castleRights = parts[2] ?? null
        this.enPassantTarget = parts[3] ?? null
        this.halfMoveClock = parts[4] ?? null
        this.fullMoveCounter = parts[5] ?? null

        this.#initPositions(parts[0])
    }

    fen;
    positions;

    piecePlacement;

    sideToMove;

    castleRights;

    enPassantTarget;

    halfMoveClock;

    fullMoveCounter;

    parse(fen){
        this.fen = fen;
    }
    #initPositions(fenPart)
    {
        this.positions = {};

        // process piece placement
        const rows = fenPart.split('/')
        if(rows.length !== 8){
            throw new Error('FEN piece placement must include all eight rows')
        }

        // loop through each row
        const columnNames = ['a','b','c','d','e','f','g','h']
        const piecesMap = {
            r: 'rook',
            b: 'bishop',
            n: 'knight',
            q: 'queen',
            k: 'king',
            p: 'pawn'
        }
        for(let rowNumber=8;rowNumber>0;rowNumber--){
            const chars = rows[rowNumber-1].split('');
            let columnNumber=1;
            for(let i=0;i<chars.length;i++){
                const character = chars[i]
                if(/[1-8]/.test(character)){
                    const emptySpaces = parseInt(character)
                    const lastEmptySpace = columnNumber + emptySpaces - 1;
                    while(columnNumber <= lastEmptySpace){
                        const squareName = columnNames[columnNumber-1]+rowNumber.toString()
                        this.positions[squareName] = null;
                        columnNumber++
                    }
                }else if(/[rbnqkpRBNQKP]/.test(character)) {
                    const color = character.toUpperCase() === character ? 'white' : 'black';
                    const piece = piecesMap[character.toLowerCase()];
                    const squareName = columnNames[columnNumber-1]+rowNumber.toString()
                    this.positions[squareName] = [piece, color];
                    columnNumber++
                }else{
                    throw new Error("Unrecognized position character: "+character)
                }
            }
        }
    }

}