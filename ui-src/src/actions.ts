
import {Hash} from '../../holochain'
import {Action, GameBoard, GameParams, MoveDefinition, XY} from '../../minersweeper'

export type ReduxAction
  = { type: 'VIEW_GAME', hash: Hash }

  | { type: 'QUICK_REVEAL', coords: XY }
  | { type: 'QUICK_FLAG', coords: XY }
  | { type: 'FETCH_ACTIONS', actions: Action[] }

  | { type: 'ENQUEUE_ACTION', moveDef: MoveDefinition }
  | { type: 'DEQUEUE_ACTION' }

  | { type: 'CONFIRM_NEW_GAME', params: GameParams }
  | { type: 'FETCH_WHOAMI', agent_hash: Hash, identity: string }
  | { type: 'FETCH_CURRENT_GAMES', games: [Hash, GameBoard] }

  | { type: 'UPDATE_IDENTITIES', identities: [Hash, string] }
