// import {List} from 'immutable'

import {fetchJSON} from './common'
import {Game, GameParams, StoreState, XY} from './types'

export type Action
  = { type: 'REVEAL', coords: XY }
  | { type: 'FLAG', coords: XY }

  | { type: 'CONFIRM_NEW_GAME', params: GameParams }
  | { type: 'FETCH_CURRENT_GAMES', games: Game[] }


export function reveal(coords:XY): Action {
  return {type: 'REVEAL', coords}
}

export function flag(coords:XY): Action {
  return {type: 'FLAG', coords}
}
