import { List } from 'immutable';

export enum CellStatus {
  Concealed,
  Flagged,
  Revealed,
}

export type CellMatrix = List<List<number>>

export type Action
  = { type: 'REVEAL', coords: XY }
  | { type: 'FLAG', coords: XY }

export type XY = {x: number, y: number}

export type GameParams = {
  width: number,
  height: number,
}

export const tempGameParams: GameParams = {
  height: 100,
  width: 100,
}