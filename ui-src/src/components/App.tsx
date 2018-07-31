import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'

import './App.css';

import {fetchCurrentGames, fetchJSON} from '../common';
import store from '../store';

import Field from './Field';
import Lobby from './Lobby';

class App extends React.Component {

  public render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact={true} path="/" component={Lobby}/>
          <Route path="/game/:hash" component={withRouter(ViewGame)}/>
        </div>
      </BrowserRouter>
    );
  }
}

class ViewGame extends React.Component<any, {loading: boolean}> {

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
      this.actionsInterval = setInterval(
        () => fetchJSON('/fn/minesweeper/getState', {
          gameHash: hash
        }).then(actions => store.dispatch({
          type: 'FETCH_ACTIONS',
          actions
        })), 3000
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

const mapStateToProps = state => {
  return {currentGame: state.currentGame}
}

export default App;
