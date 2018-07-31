import {fetchJSON} from './common'
import {StoreState} from './types'

export type Action
  = { type: 'VIEW_GAME', hash: string }

  | { type: 'REVEAL', coords: XY }
  | { type: 'FLAG', coords: XY }
  | { type: 'FETCH_ACTIONS', actions: any[] }

  | { type: 'CONFIRM_NEW_GAME', params: GameParams }
  | { type: 'FETCH_CURRENT_GAMES', games: [Hash, GameParams] }

export function reveal(coords:XY): Action {
  return {type: 'REVEAL', coords}
}

export function flag(coords:XY): Action {
  return {type: 'FLAG', coords}
}
