import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom'

import './App.css';

import Lobby from './Lobby';
import GameView from './GameView';

class App extends React.Component {

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
