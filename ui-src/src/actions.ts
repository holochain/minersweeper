import {fetchJSON} from './common'
import {StoreState} from './types'

import {Hash} from '../../holochain'
import {Action, GameBoard, GameParams, XY} from '../../minesweeper'

export type ReduxAction
  = { type: 'VIEW_GAME', hash: string }

  | { type: 'QUICK_REVEAL', coords: XY }
  | { type: 'QUICK_FLAG', coords: XY }
  | { type: 'FETCH_ACTIONS', actions: Action[] }

  | { type: 'CONFIRM_NEW_GAME', params: GameParams }
  | { type: 'FETCH_WHOAMI', agentHash: Hash, identity: string }
  | { type: 'FETCH_CURRENT_GAMES', games: [Hash, GameBoard] }

  | { type: 'UPDATE_IDENTITIES', identities: [Hash, string] }
