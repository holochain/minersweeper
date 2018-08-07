import {getScores, isMine } from "../scoring";
import { Action } from "../../../minersweeper";

const testGameBoard = {
  mines: [{x: 10, y: 20}, {x: 20, y: 10}],
  size: {x: 100, y: 100},
  description: "a game board for testing",
  creatorHash: "xxx"
}

const testActions: Action[] = [
  {timestamp: 0, position: {x: 0, y: 0}, actionType: "reveal", agentHash: "XXX"},
  {timestamp: 0, position: {x: 10, y: 10}, actionType: "flag", agentHash: "XXX"},
  {timestamp: 0, position: {x: 10, y: 20}, actionType: "reveal", agentHash: "XXX"},
  {timestamp: 0, position: {x: 20, y: 10}, actionType: "flag", agentHash: "XXX"}
];

it('Can identify a mine in the game board using isMine', () => {
  expect(isMine(testGameBoard, {x:0,y:0})).toEqual(false);
  expect(isMine(testGameBoard, {x:10,y:20})).toEqual(true);
  expect(isMine(testGameBoard, {x:20,y:10})).toEqual(true);
  expect(isMine(testGameBoard, {x:10000,y:10000})).toEqual(false);
});

it('Can reduce a sequence of actions to a score', () => {
  expect(getScores(testGameBoard, testActions).get("XXX")).toEqual(-6);
});

it('Can calculate the score of multiple agents', () => {
  const newTestActions = testActions.concat({timestamp: 0, position: {x: 11, y: 11}, actionType: "reveal", agentHash: "YYY"})
  expect(getScores(testGameBoard, newTestActions).get("YYY")).toEqual(1);
  expect(getScores(testGameBoard, newTestActions).get("XXX")).toEqual(-6);
})

it('Can ignore subsequent actions in the same tile irrespective of hash', () => {
  let newTestActions = testActions.concat({timestamp: 0, position: {x: 20, y: 10}, actionType: "flag", agentHash: "YYY"})
  expect(getScores(testGameBoard, newTestActions).get("XXX")).toEqual(-6);
  expect(getScores(testGameBoard, newTestActions).get("YYY")).toEqual(0);
  newTestActions = newTestActions.concat({timestamp: 0, position: {x: 11, y: 11}, actionType: "reveal", agentHash: "YYY"})
  expect(getScores(testGameBoard, newTestActions).get("YYY")).toEqual(1);
})