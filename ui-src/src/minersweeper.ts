import { Hash } from "./holochain"


export type XY = {x: number, y: number}
export type Size = XY
export type Pos = XY

export type BoardActionType
  = "reveal"
  | "flag"

export type ChatActionType
  = "chat"

export type ActionType
  = BoardActionType
  | ChatActionType

export type BoardActionDefinition
  = {action_type: BoardActionType, position: Pos}

export type ChatActionDefinition
  = {action_type: ChatActionType, text: string}

export type ActionDefinition
  = BoardActionDefinition
  | ChatActionDefinition


export type BoardAction = BoardActionDefinition & { agent_hash: Hash, timestamp: number }
export type ChatAction = ChatActionDefinition & { agent_hash: Hash, timestamp: number }
export type Action = BoardAction | ChatAction

export interface MoveDefinition {
  game_hash: Hash;
  action: ActionDefinition;
}

export type GameState = GameBoard & {actions: Action[]}

export interface GameParams {
  description: string;
  n_mines: number;
  size: Size;
}

export interface GameBoard {
  description: string;
  mines: Pos[];
  size: Size;
  creator_hash: Hash;
}
