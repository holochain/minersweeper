/// <reference path="../../@types/holochain/index.d.ts"/>

type XY = {x: number, y: number}
type Size = XY
type Pos = XY


declare enum ActionType {
  Reveal="reveal",
  Flag="flag",
  Chat="chat",
}

type Action
  = { actionType: ActionType.Reveal, position: Pos, agentHash: Hash }
  | { actionType: ActionType.Flag, position: Pos, agentHash: Hash }
  | { actionType: ActionType.Chat, text: string, agentHash: Hash}


interface MoveDefinition {
  gameHash: Hash;
  action: Action;
}

type GameState = GameBoard & {actions: Action[]}

interface GameParams {
  description: string;
  nMines: number;
  size: Size;
}

interface GameBoard {
  description: string;
  mines: Pos[];
  size: Size;
  creatorHash: Hash;
}