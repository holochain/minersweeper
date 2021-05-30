import {Set} from 'immutable';
import store from './store'

import {Hash} from '../../holochain'
import {Action, GameBoard, MoveDefinition, Pos} from '../../minersweeper'
import {createZomeCall} from "./rsm_zome_call.js"
// make mines visible even when concealed
export const DEBUG_MODE = false

// size of a field cell in pixels
export const CELL_SIZE = 30

// number of blank "cells" to use as a margin for the game field
export const MARGIN_CELLS = 2

// when mouse moves within this many pixels of the edge, pan the field
export const MOUSE_PAN_MARGIN = 50


// pixels to move per panning update
export const MOUSE_PAN_SPEED = CELL_SIZE * 1.0
export const KEY_PAN_SPEED = CELL_SIZE * 1.0

// millisecond intervals for various polling tasks
export const FETCH_ACTIONS_INTERVAL = 1500
export const FETCH_LOBBY_INTERVAL = 3000
export const PAN_INTERVAL = 50
export const MINIMAP_DRAW_INTERVAL = 2000  // set to 0 to disable minimap
export const ACTION_QUEUE_INTERVAL = 50
export const XHR_ABORT_INTERVAL = 25

// anount of time it takes for lobby intro to finish
// used to disable animation after the first time
export const LOBBY_INTRO_TIMEOUT = 8000

export const xor = (a: number, b: number) => a && !b || !a && b


/*************************
**    zome functions    **
**************************/

/**
 * POST to `url` with JSON `data` and parse response as JSON
 */
export const fetchJSON =
(url: string, data?: any): Promise<any> => {
  return fetchHelper(url, data)
}

/**
 * POST to `url` with JSON `data` and parse response as JSON,
 * Then cancel request ASAP, so we don't spend time waiting for response
 */
export const fetchWithAbortJSON =
(url: string, data?: any): void => {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  const abortInterval = setInterval(() => {
    // will only abort after request has been sent
    xhr.abort()
    if (xhr.status === 0) {
      // abort succeeded and status has been set to '0: ABORTED'
      clearInterval(abortInterval)
    }
  }, XHR_ABORT_INTERVAL)
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.send(JSON.stringify(data));
}

const fetchHelper =
(url: string, data?: any, extraPayload?: any): Promise<any> => {
  extraPayload = extraPayload || {}
  return fetch(url, {
    ...extraPayload,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
  }).then(r => {
    return r.json()
  })
}

/**
 * Enqueue an action instead of sending it right off
 */
export const enqueueAction =
(moveDef: MoveDefinition): void => {
  store.dispatch({type: 'ENQUEUE_ACTION', moveDef})
}

/**
 * Pop an action and make the request, if queue nonempty
 */
export const dequeueAndPerformAction =
(): Promise<boolean> | null => {
  const {currentGame} = store.getState()
  if (currentGame) {
    const {actionQueue} = currentGame
    const move = actionQueue.first()
    if (move) {
      store.dispatch({type: 'DEQUEUE_ACTION'})
      createZomeCall('mines','make_move')(move)
    }
  }
  return null
}

export const fetchCurrentGames =
(): Promise<Array<[Hash, GameBoard]>> =>
  createZomeCall('mines','get_current_games')()
    .then(games => {
      store.dispatch({
        games,
        type: 'FETCH_CURRENT_GAMES'
      })
      return games
    })

/**
 * Fetch only previously unfetched identities, and update the store
 * @type {[type]}
 */
export const fetchIdentities =
(allHashes: Set<Hash>): number => {
  const knownHashes = Set.fromKeys(store.getState().identities);
  const unknownHashes = allHashes.subtract(knownHashes);
  if (!unknownHashes.isEmpty()) {
    const hashList = unknownHashes.toList().toJS();
    fetchIdentitiesForce(hashList);
    return hashList.length;
  } else {
    return 0
  }
}

/**
 * Fetch specified identities even if they have already been fetched,
 * and update the store
 */
export const fetchIdentitiesForce =
(agentHashes: Array<Hash>): Promise<void> =>
  fetchJSON('/fn/minersweeper/getIdentities', {agentHashes})
    .then(identities => {
      store.dispatch({
        identities,
        type: 'UPDATE_IDENTITIES'
      })
      return undefined
    })

export const fetchActions =
(gameHash: Hash): Promise<Array<Action>> =>
  createZomeCall('mines','get_state')({game_hash: gameHash})
  .then(actions => {
    store.dispatch({
      type: 'FETCH_ACTIONS',
      actions
    })
    const playerHashes = actions.map((action: Action) => action.agent_hash);
    fetchIdentities(Set(playerHashes));
    return actions;
  })


/*************************
**  utility functions   **
**************************/

export const mineIcons = [
  "/images/btc.svg",
  "/images/dbc.svg",
  "/images/doge.svg",
  "/images/elix.svg",
  "/images/eth.svg",
  "/images/huc.svg",
  "/images/kmd.svg",
  "/images/lrc.svg",
  "/images/ltc.svg",
  "/images/mkr.svg",
  "/images/nmc.svg",
  "/images/nxs.svg",
  "/images/ox.svg",
  "/images/pay.svg",
  "/images/pot.svg",
  "/images/powr.svg",
  "/images/tel.svg",
  "/images/xmr.svg",
  "/images/zec.svg",
  "/images/xvg.svg",
  "/images/drgn.svg",
]

export function getIconFromPos ({x, y}: Pos): string {
  const index = cantor(x, y) % mineIcons.length
  return mineIcons[index]
}

function cantor(a: number, b: number): number {
  // from https://math.stackexchange.com/questions/23503/create-unique-number-from-2-numbers
  return ((a + b) * (a + b + 1)) / 2 + b
}

export function getDisplayName(agentHash) {
  const {identities} = store.getState()
  const name = identities
    ? identities.get(agentHash) || agentHash
    : agentHash
  if (name.length > 15 ) {
    return name.substring(0,15) + "...";
  }
  else {
    return name;
  }
}
