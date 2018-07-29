import { List } from 'immutable';

import * as redux from 'redux';
import {combineReducers} from 'redux';

import {Action} from './actions';
import {CellMatrix, CellStatus, GameParams, tempGameParams, XY} from './types';

type StoreState = {
  lobby: StoreLobbyState,
  game: StoreGameState
};

type StoreGameState = {
  matrix: CellMatrix,
};

type StoreLobbyState = {
  games: List<GameParams>,
};

const initMatrix = (gameParams: GameParams): CellMatrix => {
  const rows: Array<List<CellStatus>> = []
  for (let r = 0; r < gameParams.height; r++) {
    const cells: CellStatus[] = []
    for (let c = 0; c < gameParams.width; c++) {
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
  matrix: startActions.reduce(reduceMatrix, initMatrix(tempGameParams)),
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
  const {games} = state
  switch (action.type) {
    case 'NEW_GAME': {
      const {params} = action
      return {...state, games: games.push(params) }
    }
  }
  return state
}

const root = combineReducers({game, lobby})

export default redux.createStore(root);
