import CellMatrix from "../CellMatrix";

import {Pos} from '../../../minesweeper'

const asciiBoardTest = text => {
  const mines: Pos[] = []
  const nums: Array<[Pos, number]> = []
  const flags: Set<Pos> = new Set()
  const size: Pos = {x: 0, y: text.length}
  const agentHash = "agentHash"
  text.split('\n').map(line => line.trim()).filter(x => x).map((line, y) => {
    if (size.x > 0) {
      expect(size.x).toEqual(line.length)
    }
    size.x = line.length

    line.split('').map((cell, x) => {
      const pos: Pos = {x, y}
      if (cell === '*') {
        mines.push(pos)
      } else if (cell === '#') {
        flags.add(pos)
      } else if (cell !== '.') {
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
  return board
}


it('Calculates adjacent mines for simple boards', () => {
  asciiBoardTest(`
    ..........
    .111......
    .1*1.1221.
    .111.1**1.
    .....1221.
  `)

   asciiBoardTest(`
    .1*1.1221.
    .111.1**1.
  `)

   asciiBoardTest(`
    ................................................
    ................................................
    .....................111........................
    .....................1*1........................
    .....................111........................
    ................................................
    ................................................
  `)
});

it('Calculates adjacent mines for medium boards', () => {

   asciiBoardTest(`
    1*1......1*1.........1*1........................
    111......111.........111........................
    ................................................
    ................................................
    ................................................
    ...111..............................111.........
    ...1*1.............11211............1*1.........
    ...111.............1*2*1............111.........
    ...................11211............111.........
    ........12321.......................1*1.........
    ........1***1.......................111.........
    ........12321...................................
    ................................................
    ...................12321..12321.................
    ...................1***1..1***1.................
    ...................12321..12321.................
  `)
});
