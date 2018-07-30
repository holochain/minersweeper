import { List, Map } from 'immutable';

import * as redux from 'redux';
import {combineReducers} from 'redux';

import {Action} from './actions';
import {
  CellMatrix,
  CellStatus,
  Game,
  GameParams,
  StoreGameState,
  StoreLobbyState,
  StoreState,
  XY
} from './types';

const initMatrix = (gameParams: GameParams): CellMatrix => {
  const rows: Array<List<CellStatus>> = []
  for (let r = 0; r < gameParams.size.y; r++) {
    const cells: CellStatus[] = []
    for (let c = 0; c < gameParams.size.x; c++) {
      cells.push(CellStatus.Concealed)
    }
    rows.push(List(cells))
  }
  return List(rows)
}

const reduceGameState = (state: StoreGameState, hcAction): StoreGameState => {
  const {matrix, chats} = state!
  switch (hcAction.type) {
    case 'reveal': {
      const {x, y} = hcAction.position
      return {
        chats,
        matrix: matrix.setIn([y, x], CellStatus.Revealed),
      }
    }
    case 'flag': {
      const {x, y} = hcAction.position
      return {
        chats,
        matrix: matrix.setIn([y, x], CellStatus.Flagged)
      }
    }
    case 'chat': {
      const {agentHash, text} = hcAction
      return {
        chats: chats.push({
          author: agentHash,
          message: text
        }),
        matrix,
      }
    }
  }
  return state
}

const startActions: Action[] = []

// const defaultGameState = {
//   matrix: startActions.reduce(reduceGameState, initMatrix({
//     description: "sample game",
//     nMines: 1,
//     size: {x: 2, y: 2}
//   })),
// }

const defaultLobbyState: StoreLobbyState = {
  games: Map({})
}

const defaultState: StoreState = {
  game: null,
  lobby: defaultLobbyState,
};


export function gameReducer (state: StoreGameState = null, action: Action): StoreGameState {
  if (state === null) {
    return state
  }
  const {matrix} = state!
  switch (action.type) {
    case 'REVEAL': {
      const {x, y} = action.coords
      return {...state, matrix: matrix.setIn([y, x], CellStatus.Revealed)}
    }
    case 'FLAG': {
      const {x, y} = action.coords
      return {...state, matrix: matrix.setIn([y, x], CellStatus.Flagged)}
    }
    case 'FETCH_ACTIONS': {
      return state  // TODO
    }
  }
  return state
}

export function lobbyReducer (state: StoreLobbyState = defaultLobbyState, action: Action): StoreLobbyState {
  switch (action.type) {
    case 'CONFIRM_NEW_GAME': {
      return state
    }
    case 'FETCH_CURRENT_GAMES': {
      const gamePairs = action.games.map(
        ({hash, ...game}) => [hash, game]
      )
      return {...state, games: Map(gamePairs) }
    }
  }
  return state
}

const root = combineReducers({
  game: gameReducer,
  lobby: lobbyReducer,
})

export default redux.createStore(
  root
);
