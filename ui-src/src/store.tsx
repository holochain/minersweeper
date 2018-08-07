import { List, Map } from 'immutable';
import * as redux from 'redux';
import {combineReducers} from 'redux';

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
    return a.timestamp - b.timestamp;
  }
}

function reduceGame (state: StoreState, action: ReduxAction): StoreGameState {
  const gameState = state.currentGame
  if (gameState === null) {
    return gameState
  }
  const {chats, matrix, gameHash, gameBoard} = gameState!
  let {scores} = gameState!

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
      action.actions.sort(compareActions)
      action.actions.forEach(a => {
        matrix.takeAction(a)
      })

      scores = Map(getScores(gameBoard, action.actions));
      break;
    }
  }

  const gameOver:boolean = matrix.isCompleted();

  return {
    ...gameState,
    scores,
    gameOver,
    matrix,
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
      console.log("games", action.games)
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
