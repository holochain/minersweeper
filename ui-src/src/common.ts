
// size of a field cell in pixels
export const CELL_SIZE = 30

// number of blank "cells" to use as a margin for the game field
export const MARGIN_CELLS = 2

// millisecond intervals for various polling tasks
export const FETCH_ACTIONS_INTERVAL = 1000
export const FETCH_LOBBY_INTERVAL = 3000

export const fetchJSON = (url: string, data?: any) => {
  return fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
  }).then(r => r.json())
}

export const fetchText = (url: string, data?: any) => {
  return fetch(url, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
  }).then(r => r.text())
}

export const fetchCurrentGames = dispatch =>
  fetchJSON('/fn/minersweeper/getCurrentGames')
    .then(games => dispatch({
      games,
      type: 'FETCH_CURRENT_GAMES'
    }))

export const fetchIdentities = (dispatch, agentHashes) =>
  fetchJSON('/fn/minersweeper/getIdentities', {agentHashes})
    .then(identities => dispatch({
      identities,
      type: 'UPDATE_IDENTITIES'
    }))
