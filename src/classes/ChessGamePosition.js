export default class ChessGamePosition {

    constructor(fen) {
        this.setPosition(fen)
    }

    parseFEN(fen) {
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
    }

    setPosition(fen) {
        this.parseFEN(fen)
        this.#initPositions(this.piecePlacement)
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

    // data maps for faster access
    static squareNames = [
        'a8', 'b8', 'c8', 'd8', 'e8','f8', 'g8', 'h8',
        'a7', 'b7', 'c7', 'd7', 'e7','f7', 'g7', 'h7',
        'a6', 'b6', 'c6', 'd6', 'e6','f6', 'g6', 'h6',
        'a5', 'b5', 'c5', 'd5', 'e5','f5', 'g5', 'h5',
        'a4', 'b4', 'c4', 'd4', 'e4','f4', 'g4', 'h4',
        'a3', 'b3', 'c3', 'd3', 'e3','f3', 'g3', 'h3',
        'a2', 'b2', 'c2', 'd2', 'e2','f2', 'g2', 'h2',
        'a1', 'b1', 'c1', 'd1', 'e1','f1', 'g1', 'h1',
    ];
    /**
     * 0 - white
     * 1 - black
     */
    static squareColors = [
        0,1,0,1,0,1,0,1,
        1,0,1,0,1,0,1,0,
        0,1,0,1,0,1,0,1,
        1,0,1,0,1,0,1,0,
        0,1,0,1,0,1,0,1,
        1,0,1,0,1,0,1,0,
        0,1,0,1,0,1,0,1,
        1,0,1,0,1,0,1,0,
    ];

    /**
     * TAKE THE PUZZLES!!!
     * https://chess.stackexchange.com/questions/19633/chess-problem-database-with-pgn-or-fen
     */
    static puzzles = [
        '4R3/8/8/2Pkp3/N7/4rnKB/1nb5/b1r5',
        'b1B3Q1/5K2/5NP1/n7/2p2k1P/3pN2R/1B1P4/4qn2',
        '1k6/1P5Q/8/7B/8/5K2/8/8',
        '6Q1/1Nn5/2p1rp2/2p5/2r1k2P/2PN3K/4PP2/1B2R3',
        '8/8/7N/3p2pk/3p2p1/3P4/P1K5/8',
        '1n3NR1/2B1R3/2pK1p2/2N2p2/5kbp/1r1p4/3ppr2/4b1QB',
        'K1B5/P2r4/1p1r1n2/4k3/8/3PPP2/8/8',
        '8/1P5B/8/2P5/8/6K1/NkP3p1/RN6',
        '8/8/5b2/8/8/5pk1/8/2BQK2R',
        '3N4/4BPP1/5Kpp/1BPp1Q1b/1p1kq2R/2b1r2n/1p1ppr2/8',
        '7k/1n6/7K/2p3Q1/1pr2p2/1qb5/8/1b6',
        '8/3Q4/3p4/2b2n2/3N1p2/nR2B2b/p7/k1K5',
        '4K3/4P3/P1N2pP1/1BPk1P2/4N3/pP1p1Q2/1br2P2/q1r5',
        '5br1/pKn1P3/2Q5/3n4/2P1kP1N/1Npp1R2/r5B1/qb6',
        '8/Bbp1r3/R2p2p1/2P1p1Pp/3R3K/6N1/3P1kp1/3Q4',
        '2K5/1B3N2/8/5R2/3k4/8/7B/4r3',
        '8/2p2P1n/2p2P2/p1R2P2/2P2k2/K7/P3p1P1/8',
        '1q4b1/8/N2n1NQ1/2P2p2/B1k2rRr/1p1Rp2p/4K3/B7',
        '8/8/Q6B/2p5/p2k2P1/p7/5N2/N4K2',
        '4RbB1/1pr5/N7/7n/1p1B1P2/1P1kPR2/rP6/2nK4',
        '8/P2pBq2/2P5/P2k1r2/Bp1N2Q1/1P6/2K1R1bb/8',
        '6K1/p7/P2kPp1Q/1p1NR3/3N3P/2P2Pp1/3P4/8',
        '8/8/8/4R1n1/7N/3K4/3p4/4N2k',
        '8/8/8/1p6/1p6/k7/1R6/N2N3K',
        '2b2q2/1pPP1pPP/1Np1BkNB/8/2n1PPP1/7n/7K/8',
        '8/1P2krP1/8/8/8/8/8/4K3',
        '8/1P6/8/8/3p4/1p1k4/3ppK2/8',
        '8/k3p3/8/5P1P/K6p/N7/7b/8',
        '2B5/rR5K/4N3/p4p2/R5N1/5krn/7Q/6n1',
        '3Q2br/5p2/4pN2/1p6/1K3kP1/8/2PN1P2/4R3',
        '8/8/8/8/Q7/6pK/6P1/6bk',
        '1b1q1Bn1/2pPrN1b/4Qp2/P1k5/1p1N1Rn1/1P1p4/1R1P4/4K2B',
        '4k3/7N/4K3/8/7B/8/7n/8',
        '5n2/R3P1qn/1NBNp3/1pk5/3p1P2/2b3pR/1PP2p2/1KB4Q',
        'Qb6/2p5/1PB2PPp/1PpRN1pb/p3k3/6P1/5P2/1nK5',
        '1r1R3B/4q2B/8/3N1n2/3Pr3/8/K1k2n2/2b5',
        '8/8/8/7p/5p1K/4PN2/R7/5k2',
        '8/3Q4/8/1p3N2/2k5/8/2N5/6K1',
        '3Q4/8/6pk/8/8/7P/8/4K2R',
        '8/5P2/2r2pPb/3nnk1r/1PB1pN1P/1q5p/b5P1/2K5',
        'Q7/8/2K5/8/4N2R/3P4/3Pk3/8',
        '5k2/8/5B2/8/2K5/8/8/5Q2',
        '4k2r/8/4Kp2/8/4R3/8/4R3/7n',
        '7n/Q2B4/1Bpp4/1b1kN3/p4pN1/P4Pp1/3Kn1P1/8',
        'b6/r3N1K1/1p3R2/4k1p1/2p1r3/Q1P2bqN/4n2B/4R3',
        '7/2p1p3/1p3n1R/R1q1kP2/2QNr1P1/B3p1P1/4K2n/8',
        '8/8/1q1k4/2NP4/PP3K2/1P4N1/8/8',
        'K2Q4/n3p3/2PpP1p1/2N1N3/1PPkBP2/3n3p/bP2RP2/2R3bq',
        '1B1NR3/2rp4/p2k2pQ/R6p/pK4br/P4p1p/5P1P/5N2',
        '7B/6R1/8/3pn3/3k4/Pr2p3/6K1/8',
        '1KB5/4N3/3pr1q1/R5nR/1B3kpQ/3pr1b1/5PP1/8',
        '2b3R1/1p1Q2B1/1P3Pp1/R1PB2kN/6N1/7K/pppPppP1/8',
        'Nq6/3pPPp1/P5K1/p1kPp3/2B4b/2Q5/2p1Pp2/2r2b2',
        'brR4B/3N3Q/1pnkB3/bpp2P2/8/1n6/3p4/3K4',
        '1rr2b2/8/2P1p3/Pp2P3/2PkpP2/pQ6/P3PPN1/2K5',
        '4Q3/pkp5/8/1PKN4/8/8/4B3/6B1',
        '7R/kp3p2/1p3PP1/bK6/1p4P1/1P6/8/8',
        '8/3K1N2/8/4Bk2/8/8/5nQ1/6N1',
        '7B/8/4p3/2knq2R/8/4PP2/B7/5K2',
        '5r1q/6bQ/7p/2p5/B1p5/K1ppB3/n1P1N3/rk6',
        '4Q3/n3pb2/N2R3b/3N4/1P4R1/1BqkBP1K/2ppp3/8',
        '7B/3B1p2/rP1p2R1/n2k1Pb1/N2Pp3/4P3/K2nN1r1/2R5',
        '8/8/8/6Qb/8/5k2/5P2/4R2K',
        '8/2K2p2/B7/2k2P2/5N2/2B5/8/8',
        'k7/1b6/1Qn5/8/8/8/4B2B/5K2',
        '6B1/8/3p4/8/7k/3Q4/8/K7',
        '8/Q2R4/8/2n5/2B5/4knRN/6P1/7K',
        '2N5/1B3b2/1Rp5/n1k2p2/2q2p1K/bpR1pQ2/1p2N3/4B3',
        '8/1p1R4/8/8/8/8/K3R3/2k4n',
        '8/3p4/3K4/8/3N2P1/2k2p2/R4P2/2N2B2',
        '4R3/B3b3/1r2Pp2/N1Pk1p2/5P2/N1PKQ3/p1nPP1n1/rb5B',
        '6B1/8/8/8/8/1Nk5/8/3K3Q',
        '6rk/6N1/5BK1/6P1/6p1/8/8/8',
        '8/6p1/2p3p1/2n1R1P1/2pRqk2/b1B1p2K/8/8',
        '4K3/8/4N3/4k3/4P3/1P2P3/8/1Q4N1',
        '7n/3N1Np1/4k3/6Bp/2K5/5p2/Q7/4n3',
        '5q1k/4p1p1/4PPP1/2p3PK/p1Pp2P1/p2P4/P3R3/8',
        '4K3/4Q3/7k/6p1/6p1/8/8/8',
        '8/8/8/3N4/8/pk1B4/b2Q4/K7',
        '4RQ2/1B6/8/B2pb3/2Pk2p1/6P1/4P3/3K4',
        '2R3B1/4K3/2pN4/1N2kppb/7p/n2p2P1/5P2/1n5Q',
        '8/5p1R/5p1P/8/4k3/2n1B3/4P3/K7',
        '8/1NK2bPp/k2P1p2/3B1nR1/2P4p/1p5R/Prrp1BQ1/8',
        'b7/1k6/8/3P4/2Q5/8/7B/6BK',
        '8/1n6/8/7Q/k2K4/pNB5/b2p4/1n1r4',
        '8/4p3/2pNP3/Kp6/8/k1p5/p1P5/B7',
        '8/BNkp4/3N1P2/8/2K5/8/8/8',
        '2r1b3/3P4/3n1prp/2p2Nbk/q7/4N3/2p5/3n3K',
        '8/4Kn2/1p1P2p1/Q1B2kp1/1P1r4/3P1N1P/4N1n1/1B2b3',
        '8/7B/2K1p1Q1/3pN3/3k1p2/1P6/3P1q2/3n4',
        '3K4/B3p3/7p/2N2b1Q/p1rkPP1n/r2p3R/N4P2/3n4',
        '1n2R3/2N5/3bBp2/1Kp1p3/1p1Pkpp1/3N4/3PPQ1n/3r4',
        '2NK3k/2Np4/1p6/1b1P4/p1p2pRp/2r2p2/5P2/4n1n1',
        '8/5N2/1p1p2N1/1p1B4/1p1K2k1/1P1PQ3/pP2P2R/5R2',
    ];
}