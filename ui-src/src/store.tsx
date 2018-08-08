import { List, Map } from 'immutable';
import * as redux from 'redux';

import {ReduxAction} from './actions';
import CellMatrix from './CellMatrix';
import {getScores} from './scoring'
import {Hash} from '../../holochain';

import {
  StoreGameState,
  StoreState,
} from './types';

import {Action} from '../../minersweeper'


const defaultState: StoreState = {
  allGames: Map({}),
  identities: Map({}),
  currentGame: null,
  myActions: 0,
  whoami: null
};


// from here https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
const hashCode = (str: string) => {
  let hash: number = 0;
  if (str.length === 0) { return hash };
  for (let i: number = 0; i < str.length; i++) {
    const char: number = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

const compareActions = (a: Action, b: Action) => {
  if(a.timestamp === b.timestamp) {
    return hashCode(JSON.stringify(a)) - hashCode(JSON.stringify(b));
  } else {
    return a.timestamp! - b.timestamp!;
  }
}

function reduceGame (state: StoreState, action: ReduxAction): StoreGameState {
  const gameState = state.currentGame
  if (gameState === null) {
    return gameState
  }
  const {matrix, gameBoard} = gameState!
  let {chats, actionQueue, scores} = gameState!

  switch (action.type) {
    // TODO: use matrix.takeAction
    case 'QUICK_REVEAL': {
      const {coords} = action
      matrix.triggerReveal(coords)
      break;
    }
    case 'QUICK_FLAG': {
      const {coords} = action
      if (!matrix.isMine(coords)) {
        matrix.triggerReveal(coords)
      }
      matrix.flagCell(coords, state.whoami!.agentHash)
      break;
    }
    case 'FETCH_ACTIONS': {
      chats = chats.clear()
      action.actions.sort(compareActions)
      action.actions.forEach(a => {
        switch (a.actionType) {
          case "flag":
          case "reveal":
            // update game board
              matrix.takeAction(a)
            break;
          case "chat":
            chats = chats.push({
              author: a.agentHash,
              message: a.text,
              timestamp: a.timestamp!,
            })
            break;
          default:
            break;
        }
      })

      // update scores
      scores = Map(getScores(gameBoard, action.actions));
      break;
    }
    case 'ENQUEUE_ACTION': {
      const {moveDef} = action
      actionQueue = actionQueue.push(moveDef)
      break;
    }
    case 'DEQUEUE_ACTION': {
      actionQueue = actionQueue.shift()
      break;
    }
  }

  const gameOver:boolean = matrix.isCompleted();

  return {
    ...gameState,
    actionQueue,
    scores,
    gameOver,
    matrix,
    chats,
  }
}

export function reducer (oldState: StoreState = defaultState, action: ReduxAction): StoreState {
  const state = {
    ...oldState,
    currentGame: reduceGame(oldState, action),
    myActions: oldState.myActions + 1,
  }

  switch (action.type) {
    // Game reducer
    case 'VIEW_GAME': {
      const {hash} = action
      const gameBoard = state.allGames.get(hash)
      const matrix = new CellMatrix(gameBoard)
      const scores = oldState.currentGame == null ? null : oldState.currentGame!.scores
      const gameOver = matrix.isCompleted()
      const currentGame: StoreGameState = {
        chats: List(),
        gameHash: hash,
        actionQueue: List(),
        matrix,
        scores,
        gameBoard,
        gameOver,
      }
      return {...state, currentGame}
    }
    case 'CONFIRM_NEW_GAME': {
      return state
    }
    case 'FETCH_WHOAMI': {
      const {agentHash, identity} = action
      console.log('whoami:', agentHash, identity)
      return {
        ...state,
        whoami: {agentHash, identity}
      }
    }
    case 'FETCH_CURRENT_GAMES': {
      return {...state, allGames: Map(action.games) }
    }
    case 'UPDATE_IDENTITIES': {
      // console.log("Updating IDs: ", Map([state.identities, action.identities])
      const newIdentities: Map<Hash, string> = Map(action.identities);
      const oldIdentities: Map<Hash, string> = Map(state.identities);

      return {...state, identities: oldIdentities.merge(newIdentities) }
    }
  }
  return state
}


export default redux.createStore(
  reducer
);
