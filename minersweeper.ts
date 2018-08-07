import { Hash } from "./holochain"


export type XY = {x: number, y: number}
export type Size = XY
export type Pos = XY

export type ActionType
  = "reveal"
  | "flag"
  | "chat"


export type ActionDefinition
  = { actionType: "reveal", position: Pos }
  | { actionType: "flag", position: Pos }
  | { actionType: "chat", text: string }

export type Action = ActionDefinition & { agentHash: Hash, timestamp?: number }

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
