import { List } from 'immutable';
import * as React from 'react';
import {Link} from 'react-router-dom';
import './Lobby.css';

import {connect} from 'react-redux';

import {fetchJSON} from '../common';

import CreateGameForm from './CreateGameForm'
// import Bitcoin from "./bitcoin.png"
// import { Bitcoin, DarkBitcoin, Moreno }


interface ILobbyProps {
  games: List<GameParams>
}

class Lobby extends React.Component<any, {}> {
  public CryptoIcons = [];
  // CryptoIcons.push(Bitcoin, ... )

  public componentWillMount() {
    setInterval(
      () => {
        fetchJSON('/fn/minesweeper/getCurrentGames')
          .then(games => this.props.dispatch({
            games,
            type: 'FETCH_CURRENT_GAMES'
          }))
      },
      5000
     )
  }

  // public renderCryptoIcons() {
  //   return CryptoIcons.map((icon) => {
  //     return (
  //       <p>
  //        <img
  //         key={icon}
  //         src={icon}/>
  //       </p>
  //     );
  //   });
  // }

  public render() {
    const allGames = this.props.allGames
    return (
      <div>
        <div className="screen">
          <div className="Lobby">
            <div className="lobby-jumbotron">
              <h1 className="lobby-header">Welcome to Minersweeper</h1>
            </div>
            <div className="lobby-register">
              <h4>Create a Game Below</h4>
              <CreateGameForm/>
              <GameList allGames={allGames}/>
            </div>
          </div>
          <p/>
          <img/>
           {/* {this.renderCryptoIcons()} */}
        </div>
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
            {console.log("game", game)}
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
