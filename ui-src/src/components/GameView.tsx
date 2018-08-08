import * as React from 'react';
import {Link} from 'react-router-dom';

import './GameView.css';

import { connect } from 'react-redux';

import { fetchCurrentGames } from '../common';
import store from '../store';
import {StoreState} from '../types';

import Field from './Field';
import GameHUD from './GameHUD';
import GameOver from './GameOver';

type FieldProps = any
type FieldState = {
  loading: boolean,
  invalid: boolean
}

class GameView extends React.Component<FieldProps, FieldState> {


  constructor(props: FieldProps) {
    super(props)
    this.state = {
      loading: true,
      invalid: false,
    }
  }

  public componentWillMount() {
    const hash = this.props.match.params.hash
    if (hash) {
      const dispatchViewGame = () => store.dispatch({
        hash,
        type: 'VIEW_GAME',
      })
      if (store.getState().allGames.has(hash)) {
        dispatchViewGame()
      } else {
        this.setState({ loading: true })
        fetchCurrentGames().then(() => {
          this.setState({ loading: false })
          if (store.getState().allGames.has(hash)) {
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
    const invalidGame = <div>
      <h2>This game no longer exists...</h2>
      <Link to="/"> back to lobby</Link>
    </div>

    if (currentGame) {
      const { matrix, gameHash } = currentGame
      return <div className="game-container">
        <Field gameHash={gameHash} matrix={matrix} />
        <GameHUD />
        { currentGame.gameOver === true
          ? <GameOver />
          : null }
      </div>
    } else {
      return (
        this.state.invalid
        ? invalidGame
        : this.state.loading
        ? <h1>loading...</h1>
        : <h1>Game not found...</h1>
      )
    }
  }
}


const mapStateToProps = (state: StoreState) => ({
  currentGame: state.currentGame
})

export default connect(mapStateToProps)(GameView);
