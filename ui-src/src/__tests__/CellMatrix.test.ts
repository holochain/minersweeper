import { CellMatrix } from "../CellMatrix";

const testGameBoard = {
  mines: [{x: 10, y: 20}, {x: 20, y: 10}],
  size: {x: 100, y: 100},
  description: "a game board for testing",
  creatorHash: "xxx"
}

it('Can create a cell matrix instance with mines correctly set', () => {
  let cm = new CellMatrix(testGameBoard);
  expect(cm.size).toEqual(testGameBoard.size);
  expect(cm.isMine({x: 3, y: 8})).toEqual(false);
  expect(cm.isMine({x: 10, y: 20})).toEqual(true);
  expect(cm.isMine({x: 20, y: 10})).toEqual(true);
});

it('Can set the count of adjacent mines for each cell', () => {
  let cm = new CellMatrix(testGameBoard);
  expect(cm.isMine({x: 10, y: 20})).toEqual(true);
  expect(cm.getAdjacentMines({x: 10, y: 20})).toEqual(0);
  expect(cm.getAdjacentMines({x: 9, y: 20})).toEqual(1);
  expect(cm.getAdjacentMines({x: 10, y: 21})).toEqual(1);
});

it('Can flag a cell and retrieve the value', () => {
  let cm = new CellMatrix(testGameBoard);
  cm.flagCell({x: 1, y: 1}, "MYHASH!");
  expect(cm.isFlagged({x: 1, y: 1})).toEqual(true);
  expect(cm.isFlagged({x: 2, y: 2})).toEqual(false);

  expect(cm.getFlag({x: 1, y: 1})).toEqual("MYHASH!");
  expect(cm.getFlag({x: 2, y: 2})).toEqual(null);
});
 
it('Can reveal a cell and store the status', () => {
  let cm = new CellMatrix(testGameBoard);
  cm.revealCells({x: 1, y: 1});
  expect(cm.isRevealed({x: 2, y: 2})).toEqual(false)
  expect(cm.isRevealed({x: 1, y: 1})).toEqual(true)
});



