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
  identities: Map({}),
  currentGame: null,
  myActions: 0
};

function reduceGame (state: StoreGameState, action: ReduxAction) {
  if (state === null) {
    return state
  }
  const {chats, matrix} = state!
  switch (action.type) {
    case 'QUICK_REVEAL': {
      matrix.triggerReveal(action.coords)
      break;
    }
    case 'QUICK_FLAG': {
      // TODO
      matrix.flagCell(action.coords, "TODO")
      break;
    }
    case 'FETCH_ACTIONS': {
      action.actions.forEach(a => {
        matrix.takeAction(a)
      })
      break;
    }
  }
  return {
    matrix,
    ...state
  }
}

export function reducer (oldState: StoreState = defaultState, action: ReduxAction): StoreState {
  const state = {
    ...oldState,
    currentGame: reduceGame(oldState.currentGame, action),
    myActions: oldState.myActions + 1,
  }

  switch (action.type) {
    // Game reducer
    case 'VIEW_GAME': {
      const {hash} = action
      const gameBoard = state.allGames.get(hash)
      const matrix = new CellMatrix(gameBoard)
      const currentGame: StoreGameState = {
        chats: List(),
        gameHash: hash,
        matrix,
      }
      return {...state, currentGame}
    }
    case 'CONFIRM_NEW_GAME': {
      return state
    }
    case 'FETCH_CURRENT_GAMES': {
      console.log("games",action.games)
      return {...state, allGames: Map(action.games) }
    }
    case 'UPDATE_IDENTITIES': {
      console.log("adding ids: ", action.identities)
      return{...state, identities: Map([state.identities, action.identities]) }
    }
  }
  return state
}


export default redux.createStore(
  reducer
);
