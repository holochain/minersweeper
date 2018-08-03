import * as React from 'react';
import {withRouter, Redirect} from 'react-router';

import './GameView.css';

import { connect } from 'react-redux';

import {
  fetchCurrentGames,
  fetchJSON,
  FETCH_ACTIONS_INTERVAL
} from '../common';
import store from '../store';

import Field from './Field';
import GameHUD from './GameHUD';
import GameOver from './GameOver';

type FieldProps = any
type FieldState = {
  loading: boolean,
  invalid: boolean
}

class GameView extends React.Component<FieldProps, FieldState> {

  private actionsInterval: any = null

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      invalid: false,
    }
  }

  public componentWillMount() {
    const hash = this.props.match.params.hash
    if (hash) {
      const { allGames } = store.getState()
      const dispatchViewGame = () => store.dispatch({
        hash,
        type: 'VIEW_GAME',
      })
      if (allGames.has(hash)) {
        dispatchViewGame()
      } else {
        this.setState({ loading: true })
        fetchCurrentGames(store.dispatch).then(() => {
          this.setState({ loading: false })
          if (allGames.has(hash)) {
            dispatchViewGame()
            this.forceUpdate()
          } else {
            this.setState({invalid: true})
          }
        })
      }
    }
  }

  public render() {
    const { currentGame } = store.getState()

    if (currentGame) {
      const { matrix, gameHash } = currentGame
      if (currentGame.gameOver === true) {
        return <div className="game-container">
          <Field gameHash={gameHash} matrix={matrix} />
          <GameOver />
        </div>
      }
      else {
        return <div className="game-container">
          <Field gameHash={gameHash} matrix={matrix} />
          <GameHUD />
        </div>
      }
    } else {
      return (
        this.state.invalid
        ? <Redirect to="/" />
        : this.state.loading
        ? <h1>loading...</h1>
        : <h1>Game not found...</h1>
      )
    }
  }
}


const mapStateToProps = state => ({
  currentGame: state.currentGame
})

export default connect(mapStateToProps)(GameView);
