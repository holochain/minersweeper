import { List } from 'immutable';

declare enum CellStatus {
  Concealed,
  Flagged,
  Revealed,
}

type CellMatrix = List<List<CellStatus>>

export type XY = {x: number, y: number}
export type Size = XY
export type Pos = XY

type GameParams = {
  width: number,
  height: number,
}


declare enum ActionType {
  Reveal="reveal",
  Flag="flag",
  Chat="chat",
}

export interface Action {
  actionType: ActionType;
  agentHash: Hash;
  position?: Pos;
  text?: string;
}

export interface MoveDefinition {
  gameHash: Hash;
  action: Action;
}

export interface GameState {
  actions: Action[];
}

export interface GameDefinition {
  description: string;
  nMines: number;
  size: Size;
}

export interface GameBoard {
  description: string;
  mines: Pos[];
  size: Size;
  creatorHash: Hash;
}