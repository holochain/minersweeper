import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'


import './App.css';

import {fetchJSON, LOBBY_INTRO_TIMEOUT} from '../common'
import store from '../store'

import Lobby from './Lobby';
import GameView from './GameView';


class App extends React.Component<{}, {doAnimation: boolean}> {

  constructor(props: {}) {
    super(props)
    this.state = {
       doAnimation: true,
    }
  }

  public componentWillMount() {
    // fetchJSON('/fn/minersweeper/whoami').then(([agent_hash, identity]) =>
    //   store.dispatch({
    //     type: 'FETCH_WHOAMI',
    //     agent_hash,
    //     identity
    //   })
    // )
  }

  public componentDidMount() {
    // ~8 seconds after page load, turn off some animations
    setTimeout(() => this.setState({doAnimation: false}), LOBBY_INTRO_TIMEOUT)
  }

  public render() {
    const animationClass = this.state.doAnimation ? '' : 'no-animation'
    return (
      <BrowserRouter>
        <div className={`App ${animationClass}`}>
          <Route exact={true} path="/" component={Lobby}/>
          <Route path="/game/:hash" component={GameView}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
