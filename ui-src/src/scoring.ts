import { GameBoard, Action, Pos, Size } from "../../minesweeper";
import { Hash } from "../../holochain";
import {fromJS} from 'immutable';

export const CLICK_MINE = -10;
export const CLICK_NON_MINE = 1;
export const FLAG_MINE = 5;
export const FLAG_NON_MINE = -2;

// returns the scores for all players that have made moves in the game
export const getScores = (gameBoard: GameBoard, actions: Action[]): Map<Hash, number> => {

  return actions.reduce((scores, action, index) => {

    let newScore = scores.get(action.agentHash);
    if (newScore === undefined) { newScore = 0; }

    if (isFirst(action, index, actions)) {
      switch(action.actionType) {
        case "flag":
          if(isMine(gameBoard, action.position)) {
            newScore += FLAG_MINE;
          } else {
            newScore += FLAG_NON_MINE;
          }
          break;
        case "reveal":
          if(isMine(gameBoard, action.position)) {
            newScore += CLICK_MINE;
          } else {
            newScore += CLICK_NON_MINE;
          }
          break;
        default:
          break;
      }
    }

    return scores.set(action.agentHash, newScore);
  }, new Map<Hash, number>());

}

// only the first action on each square is allowed to generate a score.
// Assumes actions are sorted ascending in time
const isFirst = (action: Action, index: number, actions: Action[]): boolean => {
  if (action.actionType === "chat") { return false; }
  return actions.findIndex((compareAction: Action): boolean => {
    if (compareAction.actionType === "chat") { return false; }
    return action.position.x === compareAction.position.x && action.position.y === compareAction.position.y;
  }) === index; // returns true for the first action at each position
}


export const isMine = (gameBoard: GameBoard, pos: Pos): boolean => {
  return gameBoard.mines.some(mine => {
    return mine.x === pos.x && mine.y === pos.y;
  })
};
