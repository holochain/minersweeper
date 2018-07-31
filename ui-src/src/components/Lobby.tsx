import { List } from 'immutable';
import * as React from 'react';
import {Link} from 'react-router-dom';
import './Lobby.css';

import {Action, ActionType, GameBoard, GameParams, MoveDefinition, XY} from '../../../minesweeper'

import {connect} from 'react-redux';

import {fetchJSON, FETCH_LOBBY_INTERVAL} from '../common';

import CreateGameForm from './CreateGameForm'

// interface LobbyProps {
//   games: List<GameParams>
// }

class Lobby extends React.Component<any, {}> {

  private updateLobbyInterval: any = null

  public componentWillMount() {
    const updateLobby = () => {
      fetchJSON('/fn/minersweeper/getCurrentGames')
        .then(games => this.props.dispatch({
          games,
          type: 'FETCH_CURRENT_GAMES'
        }))
    }
    updateLobby()
    this.updateLobbyInterval = setInterval(
      updateLobby, FETCH_LOBBY_INTERVAL
     )
  }

  public componentWillUnmount() {
    clearInterval(this.updateLobbyInterval)
  }

  public render() {
    const allGames = this.props.allGames
    return (
      <div className="Lobby">
        <CreateGameForm/>
        <GameList allGames={allGames}/>
      </div>
    );
  }
}

const GameList = ({allGames}) => {
  if (allGames) {
    return <ul> {
      Object.keys(allGames.toJS()).map(hash => {
        const game = allGames.get(hash)
        return <li key={hash}>
          <Link to={`/game/${hash}`}>
            {game.description}
          </Link>
        </li>
      })
    } </ul>
  } else {
    return <ul/>
  }
}

const mapStateToProps = ({allGames}) => ({
  allGames
})

export default connect(mapStateToProps)(Lobby);
