import { List } from 'immutable';

export enum CellStatus {
  Concealed,
  Flagged,
  Revealed,
}

export type CellMatrix = List<List<number>>

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
  lobby: StoreLobbyState,
  game: StoreGameState
};

export type StoreGameState = {
  matrix: CellMatrix,
};

export type StoreLobbyState = {
  games: List<GameParams>,
};
