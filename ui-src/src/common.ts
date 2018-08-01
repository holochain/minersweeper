
export const CELL_SIZE = 30
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

export const fetchCurrentGames = dispatch =>
  fetchJSON('/fn/minersweeper/getCurrentGames')
    .then(games => dispatch({
      games,
      type: 'FETCH_CURRENT_GAMES'
    }))
