import {Pos} from '../../minersweeper'

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

export const xor = (a, b) => a && !b || !a && b

export const fetchJSON = (url: string, data?: any) => {
  return fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
  }).then(r => r.json())
}

export const fetchCurrentGames = dispatch =>
  fetchJSON('/fn/minersweeper/getCurrentGames')
    .then(games => dispatch({
      games,
      type: 'FETCH_CURRENT_GAMES'
    }))


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
