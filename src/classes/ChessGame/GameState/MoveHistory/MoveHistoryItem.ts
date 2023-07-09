import ChessMove from "../../Moves/ChessMove";
import FenNumber from "../FenNumber";
import PiecePositions from "../PiecePositions";

export default class MoveHistoryItem {

    move: ChessMove

    moveIndex: number|undefined

    fenBefore: FenNumber|undefined

    fenAfter: FenNumber|undefined



}