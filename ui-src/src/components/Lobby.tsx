import * as React from 'react';
import './Lobby.css';

// import {GameParams, tempGameParams} from './types';
import CreateGameForm from './CreateGameForm'

class Lobby extends React.Component {

  public render() {
    return (
      <div className="Lobby">
        <CreateGameForm/>
      </div>
    );
  }
}

export default Lobby;
