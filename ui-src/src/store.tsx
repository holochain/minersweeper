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
        ...state!,
        matrix: matrix.setIn([y, x], CellStatus.Revealed),
      }
    }
    case 'flag': {
      const {x, y} = hcAction.position
      return {
        ...state!,
        matrix: matrix.setIn([y, x], CellStatus.Flagged)
      }
    }
    case 'chat': {
      const {agentHash, text} = hcAction
      return {
        ...state!,
        chats: chats.push({
          author: agentHash,
          message: text
        }),
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

const defaultState: StoreState = {
  allGames: Map({}),
  currentGame: null,
};

function reduceGame (state: StoreGameState, action: Action) {
  if (state === null) {
    return state
  }
  const {chats, matrix} = state!
  switch (action.type) {
    case 'REVEAL': {
      const {x, y} = action.coords
      return {...state!, matrix: matrix.setIn([y, x], CellStatus.Revealed)}
    }
    case 'FLAG': {
      const {x, y} = action.coords
      return {...state!, matrix: matrix.setIn([y, x], CellStatus.Flagged)}
    }
    case 'FETCH_ACTIONS': {
      return state  // TODO
    }
  }
  return state
}

export function reducer (state: StoreState = defaultState, action: Action): StoreState {

  state.currentGame = reduceGame(state.currentGame, action)

  switch (action.type) {
    // Game reducer
    case 'VIEW_GAME': {
      const {hash} = action
      const gameParams = state.allGames.get(hash)
      const matrix = initMatrix(gameParams)
      const currentGame: StoreGameState = {
        chats: List(),
        matrix,
        params: gameParams
      }
      return {...state, currentGame}
    }

    //
    case 'CONFIRM_NEW_GAME': {
      return state
    }
    case 'FETCH_CURRENT_GAMES': {
      const gamePairs = action.games.map(
        ({hash, ...game}) => [hash, game]
      )
      return {...state, allGames: Map(gamePairs) }
    }
  }
  return state
}


export default redux.createStore(
  reducer
);
