import * as React from 'react';

import {
  fetchCurrentGames,
  fetchJSON,
  FETCH_ACTIONS_INTERVAL
} from '../common';
import store from '../store';

import Field from './Field';

class GameView extends React.Component<any, {loading: boolean}> {

  private actionsInterval: any = null

  constructor(props) {
    super(props)
    this.state = {loading: false}
  }

  public componentWillMount() {
    const hash = this.props.match.params.hash
    if (hash) {
      const {allGames} = store.getState()
      const dispatchViewGame = () => store.dispatch({
        hash,
        type: 'VIEW_GAME',
      })
      if (!allGames.has(hash)) {
        this.setState({loading: true})
        fetchCurrentGames(store.dispatch).then(() => {
          dispatchViewGame()
          this.forceUpdate()
          this.setState({loading: false})
        })
      } else {
        dispatchViewGame()
      }

      const fetchActions = () => fetchJSON('/fn/minersweeper/getState', {
        gameHash: hash
      }).then(actions => store.dispatch({
        type: 'FETCH_ACTIONS',
        actions
      }))

      fetchActions()
      this.actionsInterval = setInterval(
        fetchActions, FETCH_ACTIONS_INTERVAL
      )
    }
  }

  public componentWillUnmount() {
    clearInterval(this.actionsInterval)
  }

  public render() {
    const {currentGame} = store.getState()
    if (currentGame) {
      const {matrix, gameHash} = currentGame
      return <Field gameHash={gameHash} matrix={matrix} actions={[]} />
    } else {
      return this.state.loading ? <h1>loading...</h1> : <h1>Game not found...</h1>
    }
  }
}

export default GameView;