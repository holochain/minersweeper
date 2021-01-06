
import { Hash } from "../../holochain";
import { GameBoard, Action, Pos } from "../../minersweeper";

export const CLICK_MINE = -10;
export const CLICK_NON_MINE = 1;
export const FLAG_MINE = 5;
export const FLAG_NON_MINE = -2;

type ScoreMap = Map<Hash, number>
type ScoreTupleMap = Map<Hash, [number,number]>

// returns the scores for all players that have made moves in the game
export const getScores = (gameBoard: GameBoard, actions: Action[]): Map<Hash, number> => {
  return actions.reduce<ScoreMap>((scores: ScoreMap, action: Action, index: number): ScoreMap => {
    let newScore = scores.get(action.agent_hash);
    if (newScore === undefined) { newScore = 0; }
    if (isFirst(action, index, actions)) {
      switch(action.action_type) {
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
    return scores.set(action.agent_hash, newScore);
  }, new Map<Hash, number>());
}

// only the first action on each square is allowed to generate a score.
// Assumes actions are sorted ascending in time
export const isFirst = (action: Action, index: number, actions: Action[]): boolean => {
  if (action.action_type === "chat") { return true; }
  return actions.findIndex((compareAction: Action): boolean => {
    if (compareAction.action_type === "chat") { return false; }
    return action.position.x === compareAction.position.x && action.position.y === compareAction.position.y;
  }) === index; // returns true for the first action at each position
}


export const isMine = (gameBoard: GameBoard, pos: Pos): boolean => {
  return gameBoard.mines.some(mine => {
    return mine.x === pos.x && mine.y === pos.y;
  })
};


// ideas for end of game stats per player:
// mines clicked
// number of actions
// flagging accuracy (nCorrectFlags / nFlags)
// longest streak (consecutive actions without hitting a mine)


export const getMinesClicked = (gameBoard: GameBoard, actions: Action[]): ScoreMap => {
  return actions.reduce<ScoreMap>((scores: ScoreMap, action: Action, index: number): ScoreMap => {
    let newScore = scores.get(action.agent_hash);
    if (newScore === undefined) { newScore = 0; }
    if (isFirst(action, index, actions) && action.action_type === "reveal" && isMine(gameBoard, action.position)) {
      newScore += 1;
    }
    return scores.set(action.agent_hash, newScore);
  }, new Map<Hash, number>());
}

export const getNumberOfActions = (gameBoard: GameBoard, actions: Action[]): ScoreMap => {
  return actions.reduce<ScoreMap>((scores: ScoreMap, action: Action, index: number): ScoreMap => {
    let newScore = scores.get(action.agent_hash);
    if (newScore === undefined) { newScore = 0; }
    if (isFirst(action, index, actions) && action.action_type !== "chat") {
      newScore += 1;
    }
    return scores.set(action.agent_hash, newScore);
  }, new Map<Hash, number>());
}

export const getFlaggingAccuracy = (gameBoard: GameBoard, actions: Action[]): ScoreMap => {
  const scoreTuples = actions.reduce<ScoreTupleMap>((scores: ScoreTupleMap, action: Action, index: number): ScoreTupleMap => {
    let newScore = scores.get(action.agent_hash);
    if (newScore === undefined) { newScore = [0,0]; }
    if (isFirst(action, index, actions) && action.action_type === "flag") {
      newScore[0] += 1;
      if(isMine(gameBoard, action.position)) {
        newScore[1] += 1;
      }
    }
    return scores.set(action.agent_hash, newScore);
  }, new Map<Hash, [number, number]>());

  const result = new Map<Hash, number>();

  for(const hash of Array.from( scoreTuples.keys()) ) {
    const counts = scoreTuples.get(hash)!;
    if(counts[0] === 0) { // catch for divide by zero
      result.set(hash, 0)
    } else {
      result.set(hash, ((counts[1] / counts[0])*100)); // returns the percentage of the accuracy count.
    }
  }
  return result
}


export const getLongestStreak = (gameBoard: GameBoard, actions: Action[]): ScoreMap => {
  const scoreTuples = actions.reduce<ScoreTupleMap>((scores: ScoreTupleMap, action: Action, index: number): ScoreTupleMap => {
    let newScore = scores.get(action.agent_hash);
    if (newScore === undefined) { newScore = [0,0]; }
    if (isFirst(action, index, actions) && action.action_type !== "chat") {
      newScore[0] += 1; // increment the streak count
      if(isMine(gameBoard, action.position)) {
        if(action.action_type === "reveal") {
          newScore[0] = 0; // revealing a mine resets
        }
      } else {
        if(action.action_type === "flag") {
          newScore[0] = 0; // flagging a non-mine resets
        }
      }
      newScore[1] = Math.max(newScore[0], newScore[1]); // increment the best streak if exceeded
    }
    return scores.set(action.agent_hash, newScore);
  }, new Map<Hash, [number, number]>());

  const result = new Map<Hash, number>();

  for(const hash of Array.from( scoreTuples.keys()) ) {
    const counts = scoreTuples.get(hash)!;
    result.set(hash, counts[1]);
  }
  return result
}
