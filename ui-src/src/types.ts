import { List } from 'immutable';

export enum CellStatus {
  Concealed,
  Flagged,
  Revealed,
}

export type CellMatrix = List<List<number>>

export type XY = {x: number, y: number}

export type GameParams = {
  width: number,
  height: number,
  description: string,
}

export const tempGameParams: GameParams = {
  description: "this is the description",
  height: 100,
  width: 100,
}