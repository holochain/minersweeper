import {GameParams, XY} from './types'


export type Action
  = { type: 'REVEAL', coords: XY }
  | { type: 'FLAG', coords: XY }
  | { type: 'NEW_GAME', params: GameParams }

export function reveal(coords:XY): Action {
  return {type: 'REVEAL', coords}
}

export function flag(coords:XY): Action {
  return {type: 'FLAG', coords}
}

export function newGame(params:GameParams): Action {
  return {type: 'NEW_GAME', params}
}
