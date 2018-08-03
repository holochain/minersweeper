import CellMatrix from "./CellMatrix";

import {Pos} from '../../minesweeper'

/**
 * Creates a game board and builds a CellMatrix state from ASCII art
 *
 * Charset:
 *   . = concealed square - ignored
 *   * = concealed mine
 *   # = flagged mine
 *   x = incorrect flag (no mine)
 *   any number = revealed square, and asserts that this number is correct
 */
export const asciiBoard = (text) => {
  const mines: Pos[] = []
  const nums: Array<[Pos, number]> = []
  const flags: Array<Pos> = []
  const size: Pos = {x: 0, y: text.length}
  const agentHash = "agentHash"
  text.split('\n').map(line => line.trim()).filter(x => x).map((line, y) => {
    if (size.x > 0) {
      expect(size.x).toEqual(line.length)
    }
    size.x = line.length

    line.split('').map((cell, x) => {
      const pos: Pos = {x, y}
      if (cell === '*' || cell === '#') {
        mines.push(pos)
      }
      if (cell === '#' || cell.toLowerCase() === 'x') {
        flags.push(pos)
      }
      if (cell >= '0' && cell <= '9') {
        const num = Number(cell)
        nums.push([pos, num])
      }
    })
  })
  const board = {
    creatorHash: 'xxx',
    description: 'auto generated ascii board',
    mines, size
  }
  const cm = new CellMatrix(board)
  nums.forEach(([pos, num]) => {
    cm.triggerReveal(pos)
    const actual = cm.getAdjacentMines(pos)
    if(actual !== num) {
      throw Error(`cell does not match (${pos.x},${pos.y}): ${actual} !== ${num}`)
    }
  })
  flags.forEach(pos => {
    cm.flagCell(pos, agentHash)
  })
  return [board, cm]
}

