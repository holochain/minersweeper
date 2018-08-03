import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'

import './App.css';

import {fetchJSON} from '../common'
import store from '../store'

import Lobby from './Lobby';
import GameView from './GameView';

import ReactPlayer from 'react-player'

class App extends React.Component {

  public componentWillMount() {
    fetchJSON('/fn/minersweeper/whoami').then(([agentHash, identity]) =>
      store.dispatch({
        type: 'FETCH_WHOAMI',
        agentHash,
        identity
      })
    )
  }

  public render() {
    return (
      <BrowserRouter>
        <div className="App">
          <ReactPlayer url='https://www.youtube.com/watch?v=JRPA0cL6LmM' playing={true} loop={true} width={0} height={0} />

          <Route exact={true} path="/" component={Lobby}/>
          <Route path="/game/:hash" component={GameView}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
