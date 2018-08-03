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
  whoami: {
    agentHash: Hash,
    identity: string
  } | null
};

export type StoreGameState = {
  matrix: CellMatrix,
  chats: List<ChatLog>,
  gameHash: Hash,
  gameOver:boolean,
} | null;
