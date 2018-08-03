
import {asciiBoard} from '../test-utils'

it('Knows about zero cells', () => {
  asciiBoard(`
    ......000.
    .111......
    .1*1.1221.
    .111.1**1.
    .....1221.
  `)

  expect(() =>
    asciiBoard(`
      ..........
      .111......
      .1*1.1201.
      .111.1**1.
      .....1221.
    `)
  ).toThrowError("cell does not match (7,2): 2 !== 0")
})

it('Can ignore any cell', () => {
  asciiBoard(`
    ..........
    .111......
    .1*1......
    .....1**1.
    .....1221.
  `)
})

it('Marks cells revealed', () => {
  const [board, matrix] = asciiBoard(`
    .1.
    .*.
    1.1
  `)
  expect(matrix.isRevealed({x: 1, y: 0})).toBe(true)
  expect(matrix.isRevealed({x: 0, y: 0})).toBe(false)
})

it('Flags cells', () => {
  const [board, matrix] = asciiBoard(`
    .11
    .#x
    1.1
  `)
  expect(matrix.isFlagged({x: 1, y: 1})).toBe(true)
  expect(matrix.isFlagged({x: 2, y: 1})).toBe(true)
})

it('Triggers mass reveal', () => {
  const [board, matrix] = asciiBoard(`
    ...
    0.*
    ...
  `)
  expect(matrix.isRevealed({x: 0, y: 0})).toBe(true)
  expect(matrix.isRevealed({x: 0, y: 1})).toBe(true)
  expect(matrix.isRevealed({x: 0, y: 2})).toBe(true)
})

describe('Auto-reveal', () => {
  it('detects correct flag count', () => {
    const [_, matrix] = asciiBoard(`
      .....
      .#2..
      ..#..
    `)
    expect(matrix.isRevealed({x:3, y: 1})).toBe(false)
    const reveals = matrix.autoReveal({x:2, y: 1})
    expect(reveals.length).toBe(6)
    expect(matrix.isRevealed({x:1, y: 0})).toBe(true)
    expect(matrix.isRevealed({x:3, y: 1})).toBe(true)
  })
  it('detects incorrect flag count', () => {
    const [_, matrix] = asciiBoard(`
      .....
      .#3*.
      ..#..
    `)
    expect(matrix.isRevealed({x:3, y: 1})).toBe(false)
    const reveals = matrix.autoReveal({x:2, y: 1})
    expect(reveals.length).toBe(0)
    expect(matrix.isRevealed({x:3, y: 1})).toBe(false)
  })
  it('disregards false flags and other revealed cells', () => {
    const [_, matrix] = asciiBoard(`
      .1...
      .#2x.
      ..#..
    `)
    expect(matrix.isRevealed({x:3, y: 1})).toBe(false)
    const reveals = matrix.autoReveal({x:2, y: 1})
    expect(reveals.length).toBe(4)
    expect(matrix.isRevealed({x:3, y: 1})).toBe(true)
  })
})

it('Calculates adjacent mines for simple boards', () => {
  asciiBoard(`
    ..........
    .111......
    .1*1.1221.
    .111.1**1.
    .....1221.
  `)

   asciiBoard(`
    .1*1.1221.
    .111.1**1.
  `)

   asciiBoard(`
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

   asciiBoard(`
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
