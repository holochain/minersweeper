
import { Map } from "immutable";

export enum CellStatus {
  Concealed,
  Flagged,
  Revealed,
}


export class CellMatrix {
  data: Uint8Array;
  size: Size;
  flags: Map<number, Hash>;

  constructor(board: GameBoard) {
    this.size = board.size;
    this.data = new Uint8Array(this.size.x*this.size.y);
    this.flags = Map<number, Hash>()
    for(let i=0;i<board.mines.length;i++){
      this.setMine(board.mines[i]);
    }
  }

  flagCell(pos: Pos, agentHash: Hash) {
    this.flags = this.flags.set(this.posToIndex(pos), agentHash);
    this.setFlagged(pos);
  }

  getFlag(pos: Pos): Hash | null {
    if(this.isFlagged(pos)) {
      return this.flags.get(this.posToIndex(pos));
    } else {
      return null;
    }
  }

  revealCells(pos: Pos) {
    // TODO: here is where the logic for revealing all adjacent zero cells should happen
    this.setRevealed(pos);
  }

  getAdjacentMines(pos: Pos): number {
    // return the first 4 bits as a number
    return this.getValue(pos) & 0b00001111;
  }

  isRevealed(pos: Pos): boolean {
    return (this.getValue(pos) & 0b01000000) > 0;
  }

  isFlagged(pos: Pos): boolean {
    return (this.getValue(pos) & 0b00100000) > 0;
  }

  isMine(pos: Pos): boolean {
    return (this.getValue(pos) & 0b00010000) > 0;
  }

  private posToIndex(pos: Pos) {
    return this.size.x*pos.x + pos.y
  }

  private getValue(pos: Pos): number {
    return this.data[this.posToIndex(pos)];
  }

  private setValue(pos: Pos, value: number) {
    this.data[this.size.x*pos.x + pos.y] = value;
  }

  private setAdjacentMineCount(pos: Pos, count: number) {
    this.setValue(pos, this.getValue(pos) | 0b01000000);
  }

  private setRevealed(pos: Pos) {
    this.setValue(pos, this.getValue(pos) | 0b01000000);
  }

  private setFlagged(pos: Pos) {
    this.setValue(pos, this.getValue(pos) | 0b00100000);
  }

  private setMine(pos: Pos) {
    this.setValue(pos, this.getValue(pos) | 0b00010000);
  }

}
