
export type XY = {x: number, y: number}
export type Size = XY
export type Pos = XY

export type ActionType
  = "reveal"
  | "flag"
  | "chat"


export type Action
  = { actionType: "reveal", position: Pos, agentHash: Hash }
  | { actionType: "flag", position: Pos, agentHash: Hash }
  | { actionType: "chat", text: string, agentHash: Hash}

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