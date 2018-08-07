import {getScores, isMine, getMinesClicked, getFlaggingAccuracy, getLongestStreak, getNumberOfActions } from "../scoring";
import { Action } from "../../../minersweeper";

const testGameBoard = {
  mines: [{x: 10, y: 20}, {x: 20, y: 10}],
  size: {x: 100, y: 100},
  description: "a game board for testing",
  creatorHash: "xxx"
}

const testActions: Action[] = [
  {position: {x: 0, y: 0}, actionType: "reveal", agentHash: "XXX"},
  {position: {x: 10, y: 10}, actionType: "flag", agentHash: "XXX"},
  {position: {x: 10, y: 20}, actionType: "reveal", agentHash: "XXX"},
  {position: {x: 20, y: 10}, actionType: "flag", agentHash: "XXX"}
];

const statsTestActions: Action[] = [
  {position: {x: 0, y: 0}, actionType: "reveal", agentHash: "XXX"},
  {position: {x: 1, y: 0}, actionType: "reveal", agentHash: "XXX"},
  {position: {x: 0, y: 1}, actionType: "reveal", agentHash: "XXX"},
  {position: {x: 1, y: 1}, actionType: "reveal", agentHash: "XXX"},
  {position: {x: 20, y: 10}, actionType: "flag", agentHash: "XXX"},
  {position: {x: 10, y: 10}, actionType: "flag", agentHash: "XXX"}, // incorrect flag esets the streak
  {position: {x: 10, y: 20}, actionType: "flag", agentHash: "XXX"}, // correct flat

  {position: {x: 0, y: 0}, actionType: "reveal", agentHash: "YYY"}, // should not trigger as it is repeat
  {position: {x: 3, y: 2}, actionType: "reveal", agentHash: "YYY"}, // new action
  {position: {x: 2, y: 3}, actionType: "reveal", agentHash: "YYY"}, // new action

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
  const newTestActions = testActions.concat({position: {x: 11, y: 11}, actionType: "reveal", agentHash: "YYY"})
  expect(getScores(testGameBoard, newTestActions).get("YYY")).toEqual(1);
  expect(getScores(testGameBoard, newTestActions).get("XXX")).toEqual(-6);
})

it('Can ignore subsequent actions in the same tile irrespective of hash', () => {
  let newTestActions = testActions.concat({position: {x: 20, y: 10}, actionType: "flag", agentHash: "YYY"})
  expect(getScores(testGameBoard, newTestActions).get("XXX")).toEqual(-6);
  expect(getScores(testGameBoard, newTestActions).get("YYY")).toEqual(0);
  newTestActions = newTestActions.concat({position: {x: 11, y: 11}, actionType: "reveal", agentHash: "YYY"})
  expect(getScores(testGameBoard, newTestActions).get("YYY")).toEqual(1);
})

it('Can correctly calculate some stats', () => {
  expect(getNumberOfActions(testGameBoard, testActions).get("XXX")).toEqual(4);
  expect(getMinesClicked(testGameBoard, testActions).get("XXX")).toEqual(1);
  expect(getFlaggingAccuracy(testGameBoard, testActions).get("XXX")).toEqual(0.5);
  expect(getLongestStreak(testGameBoard, testActions).get("XXX")).toEqual(1);
});

it('Can correctly calculate some more interesting stats', () => {
  expect(getNumberOfActions(testGameBoard, statsTestActions).get("XXX")).toEqual(7);
  expect(getMinesClicked(testGameBoard, statsTestActions).get("XXX")).toEqual(0);
  expect(getFlaggingAccuracy(testGameBoard, statsTestActions).get("XXX")).toEqual(2/3);
  expect(getLongestStreak(testGameBoard, statsTestActions).get("XXX")).toEqual(5);

  expect(getNumberOfActions(testGameBoard, statsTestActions).get("YYY")).toEqual(2);
  expect(getMinesClicked(testGameBoard, statsTestActions).get("YYY")).toEqual(0);
  expect(getFlaggingAccuracy(testGameBoard, statsTestActions).get("YYY")).toEqual(0);
  expect(getLongestStreak(testGameBoard, statsTestActions).get("YYY")).toEqual(2);
});