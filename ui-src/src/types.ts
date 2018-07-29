import { List } from 'immutable';

export enum CellStatus {
  Concealed,
  Flagged,
  Revealed,
}

export type CellMatrix = List<List<CellStatus>>

export const cellMatrix = x => List<List<CellStatus>>(x)

export type Action
  = { type: 'REVEAL', coords: XY }
  | { type: 'FLAG', coords: XY }

export type XY = {x: number, y: number}

export type GameParams = {
  width: number,
  height: number,
}

export const tempGameParams: GameParams = {
  height: 1000,
  width: 1000,
}