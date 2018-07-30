import {Hash} from '../holochain'

export type XY = {x: number, y: number}
export type Size = XY
export type Pos = XY


declare enum ActionType {
  Reveal="reveal",
  Flag="flag",
  Chat="chat",
}

export type Action
  = { actionType: ActionType.Reveal, position: Pos, agentHash: Hash }
  | { actionType: ActionType.Flag, position: Pos, agentHash: Hash }
  | { actionType: ActionType.Chat, Text: string, agentHash: Hash}


export interface MoveDefinition {
  gameHash: Hash;
  action: Action;
}

export type GameState = GameBoard & {actions: Action[]}

export interface GameParams {
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