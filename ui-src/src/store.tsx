import { List, Map, fromJS} from 'immutable';
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

import {Action} from '../../minesweeper'


const defaultState: StoreState = {
  allGames: Map({}),
  currentGame: null,
  myActions: 0
};

function reduceGame (state: StoreGameState, action: ReduxAction) {
  if (state === null) {
    return state
  }

  const {chats, matrix, gameHash, gameBoard} = state!
  let {scores} = state!
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

      scores = fromJS(getScores(gameBoard, action.actions));
      break;
    }
  }
  return {
    ...state,
    scores,
    matrix,
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
      const scores = oldState.currentGame == null ? null : oldState.currentGame!.scores
      const currentGame: StoreGameState = {
        chats: List(),
        gameHash: hash,
        matrix,
        scores,
        gameBoard
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
  }
  return state
}


export default redux.createStore(
  reducer
);
