import { List, Map } from 'immutable';

import CellMatrix from './CellMatrix';

import {Hash} from '../../holochain';
import {GameBoard} from '../../minesweeper'


export type ChatLog = {
  author: string,
  message: string
}

export type StoreState = {
  allGames: Map<string, GameBoard>,
  currentGame: StoreGameState,
  myActions: number,
};

export type StoreGameState = {
  matrix: CellMatrix,
  chats: List<ChatLog>,
  gameHash: Hash,
} | null;


