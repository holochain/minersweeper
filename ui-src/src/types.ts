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

export type XY = {x: number, y: number}

export type GameParams = {
  description: string,
  nMines: number,
  size: XY,
}

export type Game = GameParams & {
  creatorHash: string,
}

// export const tempGameParams: GameParams = {
//   description: "this is the description",
//   nMines: 50,
//   size: {
//     x: 100,
//     y: 100,
//   }
// }

// store
//
export type StoreState = {
  allGames: Map<string, GameParams>,
  currentGame: StoreGameState
};

export type StoreGameState = {
  matrix: CellMatrix,
  chats: List<ChatLog>,
  params: GameParams,
} | null;
