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

// const initMatrix = (gameParams: GameParams): CellMatrix => {
//   const rows: Array<List<CellStatus>> = []
//   for (let r = 0; r < gameParams.size.y; r++) {
//     const cells: CellStatus[] = []
//     for (let c = 0; c < gameParams.size.x; c++) {
//       cells.push(CellStatus.Concealed)
//     }
//     rows.push(List(cells))
//   }
//   return List(rows)
// }

const reduceGameState = (state: StoreGameState, hcAction: Action): StoreGameState => {
  const {matrix, chats} = state!
  switch (hcAction.actionType) {
    case 'reveal':
    case 'flag':
      matrix.takeAction(hcAction);
      return state;
      break;
    case 'chat': {
      break
      // const {agentHash, text} = hcAction
      // return {
      //   ...state!,
      //   chats: chats.push({
      //     author: agentHash,
      //     message: text
      //   }),
      // }
    }
  }
  return state
}

const defaultState: StoreState = {
  allGames: Map({}),
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
      state.matrix.triggerReveal(action.coords)
      return state
    }
    case 'QUICK_FLAG': {
      // TODO
      state.matrix.flagCell(action.coords, "TODO")
      return state
    }
    case 'FETCH_ACTIONS': {
      return state  // TODO
    }
  }
  return state
}

export function reducer (state: StoreState = defaultState, action: ReduxAction): StoreState {
  state.currentGame = reduceGame(state.currentGame, action)
  state.myActions += 1
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
      return {...state, allGames: Map(action.games) }
    }
  }
  return state
}


export default redux.createStore(
  reducer
);
