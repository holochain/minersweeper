import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'

import './App.css';

import {fetchJSON} from '../common'
import store from '../store'

import Lobby from './Lobby';
import GameView from './GameView';

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
          <Route exact={true} path="/" component={Lobby}/>
          <Route path="/game/:hash" component={GameView}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
