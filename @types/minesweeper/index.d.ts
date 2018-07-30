import { List } from 'immutable';

declare enum CellStatus {
  Concealed,
  Flagged,
  Revealed,
}

type CellMatrix = List<List<CellStatus>>

type Action
  = { type: 'REVEAL', coords: XY }
  | { type: 'FLAG', coords: XY }

type XY = {x: number, y: number}

type GameParams = {
  width: number,
  height: number,
}
