import {getScore, isMine } from "../scoring";
import {ActionType} from "../types";


const testGameBoard = {
  mines: [{x: 10, y: 20}, {x: 20, y: 10}],
  size: {x: 100, y: 100},
  description: "a game board for testing",
  creatorHash: "xxx"
}

const testActions: Action[] = [
  {position: {x: 0, y: 0}, actionType: ActionType.Reveal, agentHash: "XXX"},
  {position: {x: 10, y: 10}, actionType: ActionType.Flag, agentHash: "XXX"},
  {position: {x: 10, y: 20}, actionType: ActionType.Reveal, agentHash: "XXX"},
  {position: {x: 20, y: 10}, actionType: ActionType.Flag, agentHash: "XXX"}
];

it('Can identify a mine in the game board using isMine', () => {
  expect(isMine(testGameBoard, {x:0,y:0})).toEqual(false);
  expect(isMine(testGameBoard, {x:10,y:20})).toEqual(true);
  expect(isMine(testGameBoard, {x:20,y:10})).toEqual(true);
  expect(isMine(testGameBoard, {x:10000,y:10000})).toEqual(false);
});

it('Can reduce a sequence of actions to a score', () => {
  expect(getScore(testGameBoard, testActions, "XXX")).toEqual(-6);
});

it('Can ignore subsequent actions in the same tile irrespective of hash', () => {
  let newTestActions = testActions.concat({position: {x: 20, y: 10}, actionType: ActionType.Flag, agentHash: "YYY"})
  expect(getScore(testGameBoard, newTestActions, "XXX")).toEqual(-6);
  expect(getScore(testGameBoard, newTestActions, "YYY")).toEqual(0);
  newTestActions = newTestActions.concat({position: {x: 11, y: 11}, actionType: ActionType.Reveal, agentHash: "YYY"})
  expect(getScore(testGameBoard, newTestActions, "YYY")).toEqual(1);
})