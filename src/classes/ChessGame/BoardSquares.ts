// @ts-ignore
import {SquareInfo} from './ChessGame.d.ts'
export default class BoardSquares {

    static names: Array<string> = [
        'a8', 'b8', 'c8', 'd8', 'e8','f8', 'g8', 'h8',
        'a7', 'b7', 'c7', 'd7', 'e7','f7', 'g7', 'h7',
        'a6', 'b6', 'c6', 'd6', 'e6','f6', 'g6', 'h6',
        'a5', 'b5', 'c5', 'd5', 'e5','f5', 'g5', 'h5',
        'a4', 'b4', 'c4', 'd4', 'e4','f4', 'g4', 'h4',
        'a3', 'b3', 'c3', 'd3', 'e3','f3', 'g3', 'h3',
        'a2', 'b2', 'c2', 'd2', 'e2','f2', 'g2', 'h2',
        'a1', 'b1', 'c1', 'd1', 'e1','f1', 'g1', 'h1',
    ];

    static getColor(name: string): string {
        return this.getInfo(name).color
    }

    static getIndex(name: string): number {
        return this.getInfo(name).index
    }

    static getPosition(name: string, orientation: string): [number, number]{
        const position = this.getInfo(name).position[orientation] ?? null
        if(position == null){
            throw new Error("board orientation '"+orientation+"' does not exist")
        }
        return position
    }

    static squares: {[key:string]: SquareInfo};
    static getInfo(name: string): SquareInfo {
        const square = this.squares[name] ?? null
        if(square == null){
            throw new Error("square with name '"+name+"' does not exist")
        }
        return square
    };

    static getName(index: number): string {
        const name = this.names[index] ?? null
        if(index == null){
            throw new Error("square with index '"+index+"' does not exist")
        }
        return name
    }

    static {
        this.squares = {}
        let currentColor = 0; // 0 white, 1 black
        for (let index = 0; index < this.names.length; index++) {
            const name = this.names[index]

            // white
            const col = index % 8
            const row = Math.floor(index / 8)

            this.squares[name] = {
                index: index,
                name: name,
                color: currentColor == 1 ? 'black' : 'white',
                position: {
                    'white': [col, row],
                    'black': [col * -1 + 7, row * -1 + 7]
                }
            }
            if (col !== 7) {
                currentColor = currentColor == 1 ? 0 : 1
            }
        }
    }
}