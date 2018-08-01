import CellMatrix from "../CellMatrix";

const testGameBoard = {
  creatorHash: "xxx",
  description: "a game board for testing",
  mines: [{x: 10, y: 20}, {x: 20, y: 10}],
  size: {x: 100, y: 100},
}

const smallTestBoard = {
  creatorHash: "xxx",
  description: "a small game board for testing",
  mines: [{x: 2, y: 2}],
  size: {x: 5, y: 5},
}

it('Can create a cell matrix instance with mines correctly set', () => {
  const cm = new CellMatrix(testGameBoard);
  expect(cm.size).toEqual(testGameBoard.size);
  expect(cm.isMine({x: 3, y: 8})).toEqual(false);
  expect(cm.isMine({x: 10, y: 20})).toEqual(true);
  expect(cm.isMine({x: 20, y: 10})).toEqual(true);
});

it('Can set the count of adjacent mines for each cell', () => {
  const cm = new CellMatrix(testGameBoard);
  expect(cm.isMine({x: 10, y: 20})).toEqual(true);
  expect(cm.getAdjacentMines({x: 12, y: 20})).toEqual(0);
  expect(cm.getAdjacentMines({x: 11, y: 20})).toEqual(1);
  // expect(cm.getAdjacentMines({x: 10, y: 21})).toEqual(1);
});

it('Can flag a cell and retrieve the value', () => {
  const cm = new CellMatrix(testGameBoard);
  cm.flagCell({x: 1, y: 1}, "MYHASH!");
  expect(cm.isFlagged({x: 1, y: 1})).toEqual(true);
  expect(cm.isFlagged({x: 2, y: 2})).toEqual(false);

  expect(cm.getFlag({x: 1, y: 1})).toEqual("MYHASH!");
  expect(cm.getFlag({x: 2, y: 2})).toEqual(null);
});

it('Can reveal cells on a small grid', () => {
  const cm = new CellMatrix(smallTestBoard);
  expect(cm.triggerReveal({x: 0, y: 0})).toEqual(25 - 1);
  expect(cm.isRevealed({x: 0, y: 0})).toEqual(true)
  expect(cm.isRevealed({x: 2, y: 2})).toEqual(false)
  expect(cm.isRevealed({x: 4, y: 4})).toEqual(true)
});

it('Can reveal cells on a large grid', () => {
  const cm = new CellMatrix(testGameBoard);
  expect(cm.triggerReveal({x: 0, y: 0})).toEqual(100*100 - 2);
  expect(cm.isRevealed({x: 0, y: 0})).toEqual(true)
  expect(cm.isRevealed({x: 10, y: 20})).toEqual(false)
  expect(cm.isRevealed({x: 4, y: 4})).toEqual(true)
});



