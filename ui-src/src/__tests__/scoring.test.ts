import {getScores, isMine, getMinesClicked, getFlaggingAccuracy, getLongestStreak, getNumberOfActions } from "../scoring";
import { Action } from "../../../minersweeper";

const testGameBoard = {
  mines: [{x: 10, y: 20}, {x: 20, y: 10}],
  size: {x: 100, y: 100},
  description: "a game board for testing",
  creator_hash: "xxx"
}

const testActions: Action[] = [
  {timestamp: 0, position: {x: 0, y: 0}, action_type: "reveal", agent_hash: "XXX"},
  {timestamp: 0, position: {x: 10, y: 10}, action_type: "flag", agent_hash: "XXX"},
  {timestamp: 0, position: {x: 10, y: 20}, action_type: "reveal", agent_hash: "XXX"},
  {timestamp: 0, position: {x: 20, y: 10}, action_type: "flag", agent_hash: "XXX"}
];

const statsTestActions: Action[] = [
  {timestamp: 0, position: {x: 0, y: 0}, action_type: "reveal", agent_hash: "XXX"},
  {timestamp: 0, position: {x: 1, y: 0}, action_type: "reveal", agent_hash: "XXX"},
  {timestamp: 0, position: {x: 0, y: 1}, action_type: "reveal", agent_hash: "XXX"},
  {timestamp: 0, position: {x: 1, y: 1}, action_type: "reveal", agent_hash: "XXX"},
  {timestamp: 0, position: {x: 20, y: 10}, action_type: "flag", agent_hash: "XXX"},
  {timestamp: 0, position: {x: 10, y: 10}, action_type: "flag", agent_hash: "XXX"}, // incorrect flag esets the streak
  {timestamp: 0, position: {x: 10, y: 20}, action_type: "flag", agent_hash: "XXX"}, // correct flat

  {timestamp: 0, position: {x: 0, y: 0}, action_type: "reveal", agent_hash: "YYY"}, // should not trigger as it is repeat
  {timestamp: 0, position: {x: 3, y: 2}, action_type: "reveal", agent_hash: "YYY"}, // new action
  {timestamp: 0, position: {x: 2, y: 3}, action_type: "reveal", agent_hash: "YYY"}, // new action

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
  const newTestActions = testActions.concat({timestamp: 0, position: {x: 11, y: 11}, action_type: "reveal", agent_hash: "YYY"})
  expect(getScores(testGameBoard, newTestActions).get("YYY")).toEqual(1);
  expect(getScores(testGameBoard, newTestActions).get("XXX")).toEqual(-6);
})

it('Can ignore subsequent actions in the same tile irrespective of hash', () => {
  let newTestActions = testActions.concat({timestamp: 0, position: {x: 20, y: 10}, action_type: "flag", agent_hash: "YYY"})
  expect(getScores(testGameBoard, newTestActions).get("XXX")).toEqual(-6);
  expect(getScores(testGameBoard, newTestActions).get("YYY")).toEqual(0);
  newTestActions = newTestActions.concat({timestamp: 0, position: {x: 11, y: 11}, action_type: "reveal", agent_hash: "YYY"})
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