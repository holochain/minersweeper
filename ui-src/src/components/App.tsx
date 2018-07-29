import * as React from 'react';
import './App.css';

import {GameParams} from '../types';

import Field from './Field';
import Lobby from './Lobby';

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <Lobby/>
        {/*<Field gameParams={tempGameParams} actions={[]} />*/}
      </div>
    );
  }
}

export default App;
