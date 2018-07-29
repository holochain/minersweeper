import { List } from 'immutable';

import * as redux from 'redux';
import {combineReducers} from 'redux';

import {Action, cellMatrix, CellMatrix, CellStatus, GameParams, tempGameParams, XY} from './types';

type StoreState = {
  // nav: StoreNavState,
  game: StoreGameState
};

type StoreGameState = {
  matrix: CellMatrix,
  myActions: number
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

const startActions: Action[] = [

]

const defaultGameState = {
  matrix: startActions.reduce(reduceMatrix, initMatrix(tempGameParams)),
  myActions: 0,
}

const defaultState: StoreState = {
  // nav: {
  //   currentGame: null
  // },
  game: defaultGameState
};


export function game (state: StoreGameState = defaultGameState, action: Action): StoreGameState {
  state.myActions++;
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

const root = combineReducers({game})

export default redux.createStore(root);
