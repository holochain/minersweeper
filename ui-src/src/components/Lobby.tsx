import { List } from 'immutable';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './Lobby.css';

import { connect } from 'react-redux';

import { fetchJSON } from '../common';

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
              <CreateGameForm />
              <GameList allGames={allGames} />
            </div>
          </div>
          <p />
          <p />
          <p />
          {/* {this.renderCryptoIcons()} */}
        </div>
      </div>
    );
  }
}

const GameList = ({ allGames }) => {
  if (allGames) {
    return <div>
      <table>
        <h3>Live_Games</h3>
        <tr>
          <td>Game_Name</td>
          <td>Mines</td>
          <td>Size</td>
        </tr>
        {
          Object.keys(allGames.toJS()).map(hash => {
            const game = allGames.get(hash)
            return <tr key={hash}>
              <Link to={`/game/${hash}`}>
                <td>{game.description}</td>
              </Link>
              <td>{game.mines.length}</td>
              <td>{game.size.x} x {game.size.y}</td>
              {console.log("game in body", game)}
            </tr>

          })
        } </table></div>
  } else {
    return <ul />
  }
}

const mapStateToProps = ({ allGames }) => ({
  allGames
})

export default connect(mapStateToProps)(Lobby);
