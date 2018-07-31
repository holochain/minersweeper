import { List, Map } from 'immutable';



// export type CellMatrix = List<List<number>>
// export type CellMatrix = Uint8Array;

// bytes in a CellMatrix correspond to [null, revealed, flagged, isMine, nAdacentMines = last 4]


export type ChatLog = {
  author: string,
  message: string
}

export type StoreState = {
  allGames: Map<string, GameParams>,
  currentGame: StoreGameState,
  myActions: number,
};

export type StoreGameState = {
  matrix: CellMatrix,
  chats: List<ChatLog>,
  params: GameParams,
} | null;
