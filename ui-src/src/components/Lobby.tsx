import { List } from 'immutable';
import * as React from 'react';
import {Link} from 'react-router-dom';
import './Lobby.css';

import {connect} from 'react-redux';

import {fetchJSON} from '../common';
import {GameParams} from '../types';

import CreateGameForm from './CreateGameForm'


interface ILobbyProps {
  games: List<GameParams>
}

class Lobby extends React.Component<any, any> {
  public cryptoIcons = ["btc", "eth", "xmr", "ltc", "doge", "drgn", "bcc", "kmd", "dbc", "elix", "mkr", "powr", "xvg", "zec", "huc", "tel", "pot", "pay", "ox", "nxs", "nmc", "lrc"];

  constructor(props) {
     super(props);
     this.state = {addClass: false}
     this.registerGame = this.registerGame.bind(this);
   }

  public componentWillMount() {
    setInterval(
      () => {
        fetchJSON('/fn/minesweeper/getCurrentGames')
          .then(games => this.props.dispatch({
            games,
            type: 'FETCH_CURRENT_GAMES'
          }))
      },
      1000
     )
  }

  public toggleModal() {
    this.setState({addClass: !this.state.addClass});
  }

  public registerGame() {
    this.toggleModal();
    const modalClass = ["modal-container"];
    if (this.state.addClass) {
      modalClass.push("register-modal");
      document.body.classList.add("modal-active");
      console.log("modal is active!");

    }
  }

  public renderCryptoIcons() {
    return this.cryptoIcons.map((icon) => {
      return (
         <p key={icon}><img src={require(`../public/${icon}.svg`)} /></p>

      );
    });
  }

  public render() {
    const modalClass = ["modal-container"];
    const allGames = this.props.allGames

    if(this.state.addClass) {
      return (
        <div className="interstitial-modal-overlay">
          <div className="interstitial-modal">
            <div className={modalClass.join(" ")}>
              <div className="modal-background">
                <div className="modal">
                  <CreateGameForm />
                </div>
              </div>
            </div>
          </div>
         </div>
      )
    }

    return (
      <div>
        <div className="screen">
          <div className="Lobby">
            <div className="lobby-jumbotron">
              <h1 className="lobby-header">Welcome to Minersweeper</h1>
            </div>
            <div className="lobby-register">
              <h4>Create a Game Below</h4>
              <button onClick={this.registerGame}>Create Game</button>
              <GameList allGames={allGames}/>
            </div>
          </div>
           {this.renderCryptoIcons()}
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
          {console.log("game", game)}
          {game.nMines}
          {game.size}
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
