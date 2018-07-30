import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import {connect} from 'react-redux'

import './App.css';

import store from '../store';
import {GameParams} from '../types';

import Field from './Field';
import Lobby from './Lobby';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact={true} path="/" component={Lobby}/>
          <Route path="/game/:hash" component={ViewGame}/>
        </div>
      </BrowserRouter>
    );
  }
}

class ViewGame extends React.Component<any, {}> {

  public componentWillMount() {
    const hash = this.props.match.params.hash
    if (hash) {
      store.dispatch({
        hash,
        type: 'VIEW_GAME',
      })
    }
  }

  public render() {
    const {currentGame} = store.getState()
    if (currentGame) {
      const {matrix, params} = currentGame
      return <Field gameParams={currentGame} matrix={matrix} actions={[]} />
    } else {
      return <h1>Game not found...</h1>
    }
  }
}

// const mapStateToProps = state => {
//   return {currentGame: state.currentGame}
// }
export default connect()(App);
