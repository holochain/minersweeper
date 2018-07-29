import { List } from 'immutable';
import * as React from 'react';
import './Lobby.css';

import {connect} from 'react-redux';

import {fetchJSON} from '../common';
import {GameParams} from '../types';

import CreateGameForm from './CreateGameForm'

interface ILobbyProps {
  games: List<GameParams>
}

class Lobby extends React.Component<any, {}> {

  public componentWillMount() {
    setInterval(
      () => {
        fetchJSON('fn/minesweeper/getCurrentGames')
          .then(games => this.props.dispatch({
            games,
            type: 'FETCH_CURRENT_GAMES'
          }))
      },
      1000
     )
  }

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
    return <ul> {
      games.map(game => {
        return <li key={"TODO"}>{game.description}</li>
      })
    } </ul>
  } else {
    return <ul/>
  }
}

const mapStateToProps = ({lobby}) => ({
  games: lobby.games
})

export default connect(mapStateToProps)(Lobby);
