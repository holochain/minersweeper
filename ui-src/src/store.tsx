import { List, Map } from 'immutable';
import * as redux from 'redux';
import {combineReducers} from 'redux';

import {ReduxAction} from './actions';
import CellMatrix from './CellMatrix';

import {
  StoreGameState,
  StoreState,
} from './types';

import {Action} from '../../minesweeper'


const defaultState: StoreState = {
  allGames: Map({}),
  currentGame: null,
  myActions: 0,
  whoami: null
};

function reduceGame (state: StoreState, action: ReduxAction): StoreGameState {
  const gameState = state.currentGame
  if (gameState === null) {
    return gameState
  }
  const {chats, matrix} = gameState!
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
      action.actions.forEach(a => {
        matrix.takeAction(a)
      })
      break;
    }
  }

  const gameOver:boolean = matrix.isCompleted();

  return {
    ...gameState,
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
      const gameOver=matrix.isCompleted()
      const currentGame: StoreGameState = {
        chats: List(),
        gameHash: hash,
        matrix,
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
  }
  return state
}


export default redux.createStore(
  reducer
);
