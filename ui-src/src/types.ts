import { List, Map } from 'immutable';

import CellMatrix from './CellMatrix';

import {Hash} from '../../holochain';
import {GameBoard} from '../../minersweeper'


export type ChatLog = {
  author: Hash,
  message: string
}

export type StoreState = {
  allGames: Map<Hash, GameBoard>,
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
  gameOver: boolean,
} | null;
