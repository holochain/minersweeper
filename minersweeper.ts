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
  = {actionType: BoardActionType, position: Pos}

export type ChatActionDefinition
  = {actionType: ChatActionType, text: string}

export type ActionDefinition
  = BoardActionDefinition
  | ChatActionDefinition


export type BoardAction = BoardActionDefinition & { agentHash: Hash, timestamp: number }
export type ChatAction = ChatActionDefinition & { agentHash: Hash, timestamp: number }
export type Action = BoardAction | ChatAction

export interface MoveDefinition {
  gameHash: Hash;
  action: ActionDefinition;
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
