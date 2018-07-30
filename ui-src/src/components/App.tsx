import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'

import './App.css';

import {GameParams} from '../types';

import Field from './Field';
import Lobby from './Lobby';

class App extends React.Component {
  public render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route path="/" component={Lobby}/>
          <Route path="/:hash" component={ViewGame}/>
        </div>
      </BrowserRouter>
    );
  }
}

const ViewGame = ({match: {params}}) => {
  return <Field gameParams={params} actions={[]} />
}

export default App;
