import * as React from 'react';
import './App.css';

import {GameParams, tempGameParams} from './types';

import Field from './Field';

class App extends React.Component {
  public render() {

    return (
      <div className="App">
        <Field gameParams={tempGameParams} actions={[]} />
      </div>
    );
  }
}

export default App;
