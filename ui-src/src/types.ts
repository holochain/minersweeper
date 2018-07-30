import { List, Map } from 'immutable';

export enum CellStatus {
  Concealed,
  Flagged,
  Revealed,
}

export type CellMatrix = List<List<number>>

export type ChatLog = {
  author: string,
  message: string
}

export type StoreState = {
  allGames: Map<string, GameParams>,
  currentGame: StoreGameState
};

export type StoreGameState = {
  matrix: CellMatrix,
  chats: List<ChatLog>,
  params: GameParams,
} | null;
