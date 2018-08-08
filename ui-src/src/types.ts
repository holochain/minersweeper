import { List, Map } from 'immutable';

import CellMatrix from './CellMatrix';

import {Hash} from '../../holochain';
import {GameBoard, MoveDefinition} from '../../minersweeper'


export type ChatLog = {
  author: Hash,
  message: string,
  timestamp: number
}

export type StoreState = {
  allGames: Map<Hash, GameBoard>,
  identities: Map<Hash, string>,
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
  gameBoard: GameBoard,
  actionQueue: List<MoveDefinition>,
  scores: Map<Hash, number> | null,
  gameOver:boolean,
} | null;
