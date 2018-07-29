import { List } from 'immutable';
import * as React from 'react';
import './Lobby.css';

import {connect} from 'react-redux';

import {GameParams} from '../types';

import CreateGameForm from './CreateGameForm'

type LobbyProps = {
  games: List<GameParams>
}

class Lobby extends React.Component<LobbyProps, {}> {

  public render() {
    const games = this.props.games || []
    return (
      <div className="Lobby">
        <CreateGameForm/>
        <GameList games={games}/>
      </div>
    );
  }
}

const GameList = ({games}) => {
  if (games) {
    return <ul>
      {games.map(game => {
        return <li key={"TODO"}>{game.description}</li>
      })}
    </ul>
  } else {
    return <ul/>
  }
}

const mapStateToProps = ({lobby}) => ({
  games: lobby.games
})

export default connect(mapStateToProps)(Lobby);
