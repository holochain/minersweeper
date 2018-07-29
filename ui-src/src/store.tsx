import { List } from 'immutable';

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

const reduceMatrix = (matrix: CellMatrix, action): CellMatrix => {
  switch (action.type) {
    case 'REVEAL': {
      const {x, y} = action.coords
      return matrix.setIn([y, x], CellStatus.Revealed)
    }
    case 'FLAG': {
      const {x, y} = action.coords
      return matrix.setIn([y, x], CellStatus.Flagged)
    }
  }
  return matrix
}

const startActions: Action[] = []

const defaultGameState = {
  matrix: startActions.reduce(reduceMatrix, initMatrix({
    description: "sample game",
    nMines: 1,
    size: {x: 2, y: 2}
  })),
}

const defaultLobbyState = {
  games: List([])
}

const defaultState: StoreState = {
  game: defaultGameState,
  lobby: defaultLobbyState,
};


export function game (state: StoreGameState = defaultGameState, action: Action): StoreGameState {
  const {matrix} = state
  switch (action.type) {
    case 'REVEAL': {
      const {x, y} = action.coords
      return {...state, matrix: matrix.setIn([y, x], CellStatus.Revealed)}
    }
    case 'FLAG': {
      const {x, y} = action.coords
      return {...state, matrix: matrix.setIn([y, x], CellStatus.Flagged)}
    }
  }
  return state
}

export function lobby (state: StoreLobbyState = defaultLobbyState, action: Action): StoreLobbyState {
  switch (action.type) {
    case 'CONFIRM_NEW_GAME': {
      return state
    }
    case 'FETCH_CURRENT_GAMES': {
      return {...state, games: List(action.games) }
    }
  }
  return state
}

const root = combineReducers({game, lobby})

export default redux.createStore(
  root
);
