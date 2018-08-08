
import { Map } from "immutable";

import { Hash } from '../../holochain';
import {
  BoardAction,
  GameBoard,
  Pos,
  Size
} from '../../minersweeper';

export enum CellStatus {
  Concealed,
  Flagged,
  Revealed,
}

const MASK_ADJACENT = 0b00001111
const MASK_REVEALED = 0b00010000
const MASK_FLAGGED  = 0b00100000
const MASK_MINE     = 0b01000000


export default class CellMatrix {
  public size: Size;
  private nMines: number;
  private nRevealedMines: number;
  private data: Uint8Array;
  private flags: Map<number, Hash>;

  constructor(board: GameBoard) {
    this.size = board.size;
    this.data = new Uint8Array(this.size.x * this.size.y);
    this.flags = Map<number, Hash>();
    this.nMines = board.mines.length;
    this.nRevealedMines = 0;

    board.mines.forEach(minePos => this.setMine(minePos));
    board.mines.forEach(minePos => {
      this.forEachNeighbor(minePos, n => {
        this.incrementAdjacentMineCount(n);
      });
    });
  }

  public takeAction(action: BoardAction): number {
    let numRevealed = 0
    switch (action.actionType) {
      case "flag":
        if (!this.isMine(action.position)) {
          numRevealed = this.triggerReveal(action.position);
        } else if (!this.isFlagged(action.position) && !this.isRevealed(action.position)) {
          this.nRevealedMines += 1;         
        }
        this.flagCell(action.position, action.agentHash);
        break;
      case "reveal":
        numRevealed = this.triggerReveal(action.position);
        break;
      default:
        break;
    }
    return numRevealed
  }

  public flagCell(pos: Pos, agentHash: Hash) {
    this.flags = this.flags.set(this.posToIndex(pos), agentHash);
    this.setFlagged(pos);
  }

  public getFlag(pos: Pos): Hash | null {
    if (this.isFlagged(pos)) {
      return this.flags.get(this.posToIndex(pos));
    } else {
      return null;
    }
  }

  public getRemainingMines(): number {
    return this.nMines - this.nRevealedMines;
  }

  public triggerReveal(pos: Pos): number {
    const visited = new Set<number>();
    const toVisit = Array<Pos>(pos);
    let nRevealed = 0;

    if (this.isFlagged(pos) || this.isRevealed(pos)) {
      return 0;
    }

    if (this.isMine(pos)) {
      this.nRevealedMines += 1;
      this.setRevealed(pos)
      return 1;
    }

    while (toVisit.length > 0) {
      const c = toVisit.shift()!;

      if (visited.has(this.posToIndex(c))) {
        continue;
      }

      this.setRevealed(c);
      visited.add(this.posToIndex(c));
      nRevealed++;

      if (this.getAdjacentMines(c) === 0) {
        this.forEachNeighbor(c, n => {
          if (!visited.has(this.posToIndex(n))) {
            toVisit.push(n);
          }
        });
      }
    }
    return nRevealed;
  }

  public autoReveal(pos: Pos): Array<Pos> {
    const mineCount = this.getAdjacentMines(pos)
    let perceivedMines = 0
    const newReveals: Array<Pos> = []
    this.forEachNeighbor(pos, n => {
      perceivedMines += (
        this.isMine(n) && (this.isRevealed(n) || this.isFlagged(n))
      ) ? 1 : 0
    })
    if (perceivedMines === mineCount) {
      this.forEachNeighbor(pos, n => {
        if (!(this.isRevealed(n) || this.isFlagged(n))) {
          newReveals.push(n)
        }
      })
    }
    newReveals.forEach(p => this.triggerReveal(p))
    return newReveals
  }

  public getAdjacentMines(pos: Pos): number {
    // return the first 4 bits as a number
    return this.getValue(pos) & MASK_ADJACENT;
  }

  public isRevealed(pos: Pos): boolean {
    return (this.getValue(pos) & MASK_REVEALED) > 0;
  }

  public isFlagged(pos: Pos): boolean {
    return (this.getValue(pos) & MASK_FLAGGED) > 0;
  }

  public isCompleted(): boolean {
    for (let y = 0; y < this.size.y; y++) {
      for (let x = 0; x < this.size.x; x++) {
        const pos = {x,y}
        if (!this.isRevealed(pos) && !this.isFlagged(pos)) {
          return false
        }
      }
    }
    return true
  }

  public isMine(pos: Pos): boolean {
    return (this.getValue(pos) & MASK_MINE) > 0;
  }

  public isInBounds(x: number, y: number): boolean {
    return (x >= 0 && y >= 0 && x < this.size.x && y < this.size.y);
  }

  private forEachNeighbor(pos: Pos, func: (pos: Pos) => void) {
    [-1, 0, 1].forEach(dx => {
      [-1, 0, 1].forEach(dy => {
        if (dx !== 0 || dy !== 0) {
          const x = pos.x + dx;
          const y = pos.y + dy;
          if (this.isInBounds(x, y)) {
            func({x, y});
          }
        }
      });
    });
  }

  private posToIndex(pos: Pos): number {
    return this.size.x * pos.y + pos.x
  }

  private getValue(pos: Pos): number {
    return this.data[this.posToIndex(pos)];
  }

  private setValue(pos: Pos, value: number) {
    this.data[this.posToIndex(pos)] = value;
  }

  private incrementAdjacentMineCount(pos: Pos) {
    // NB: this can overflow!! use with caution
    this.data[this.posToIndex(pos)] += 1

    // FYI: this is how it should be done, but it's slower
    /*
    const lsh = this.getAdjacentMines(pos) + 1;
    const msh = this.getValue(pos) & 0b11110000;
    this.setValue(pos, lsh | msh);
     */
  }

  private setRevealed(pos: Pos) {
    this.setValue(pos, this.getValue(pos) | MASK_REVEALED);
  }

  private setFlagged(pos: Pos) {
    this.setValue(pos, this.getValue(pos) | MASK_FLAGGED);
  }

  private setMine(pos: Pos) {
    this.setValue(pos, this.getValue(pos) | MASK_MINE);
  }

}
