
import {ActionType} from "./types";

export const CLICK_MINE = -10;
export const CLICK_NON_MINE = 1;
export const FLAG_MINE = 5;
export const FLAG_NON_MINE = -2;

export const getScore = (gameBoard: GameBoard, actions: Action[], agentHash: Hash) => {

  const scoreReducer = (acc: number, action: Action): number => {
    switch(action.actionType) {
      case ActionType.Flag:
        if(isMine(gameBoard, action.position)) {
          return acc + FLAG_MINE;
        } else {
          return acc + FLAG_NON_MINE;
        }
      case ActionType.Reveal:
        if(isMine(gameBoard, action.position)) {
          return acc + CLICK_MINE;
        } else {
          return acc + CLICK_NON_MINE;
        }
    }
    return acc;
  };

  // only consider score producing actions (flag or reveal)
  // filter actions so only the first action in each position is counted (assumes already sorted)
  // then count only actions from this agentHash
  // then reduce to a single score value
  return actions
    .filter((action: Action, index, arr): boolean => {
      if(action.actionType === ActionType.Chat) return false;
      return arr.findIndex((compareAction: Action, index_, actions_): boolean => {
        if(compareAction.actionType === ActionType.Chat) return false;
        return action.position.x === compareAction.position.x && action.position.y === compareAction.position.y;
      }) === index; // returns true for the first action at each position
    })
    .filter(action => {
      return action.agentHash === agentHash;
    })
    .reduce(scoreReducer, 0);

};

export const isMine = (gameBoard: GameBoard, pos: Pos): boolean => {
  return gameBoard.mines.some(mine => {
    return mine.x === pos.x && mine.y === pos.y;
  })
};
