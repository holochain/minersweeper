import { List } from 'immutable';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './Lobby.css';

import { Action, ActionType, GameBoard, GameParams, MoveDefinition, XY } from '../../../minesweeper'

import { connect } from 'react-redux';

import Jdenticon from './Jdenticon';

import { fetchJSON, FETCH_LOBBY_INTERVAL } from '../common';

import CreateGameForm from './CreateGameForm'

// interface LobbyProps {
//   games: List<GameParams>
// }

class Lobby extends React.Component<any, any> {
  public cryptoIcons = ["btc", "eth", "xmr", "ltc", "doge", "drgn", "bcc", "kmd", "dbc", "elix", "mkr", "powr", "xvg", "zec", "huc", "tel", "pot", "pay", "ox", "nxs", "nmc", "lrc"];

  private updateLobbyInterval: any = null

  constructor(props) {
     super(props);
     this.state = {showModal: false}
     this.toggleModal = this.toggleModal.bind(this);
   }

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

  public toggleModalState() {
    this.setState({showModal: !this.state.showModal});
  }

  public toggleModal() {
    this.toggleModalState();
  }

  public renderCryptoIcons() {
    return this.cryptoIcons.map((icon) => {
      return (
        <p key={icon} className={`coin ${this.state.showModal ? 'hide' : ''}`}/>
        // <p key={icon} src={`/images/${icon}`} />
      );
    });
  }

  public componentWillUnmount() {
    clearInterval(this.updateLobbyInterval)
  }

  public render() {
    const allGames = this.props.allGames
    const modalDiv = (
      <div className="interstitial-modal-overlay">
        <div className="interstitial-modal">
          <div className="modal-container register-modal">
            <div className="modal-background">
              <div className="modal">
                <CreateGameForm onCreate={this.toggleModal}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div>
        <div className="screen">
          <div className="Lobby">
            <div className="lobby-jumbotron">
              <h1 className="lobby-header">Welcome to Minersweeper</h1>
            </div>
          </div>
          {this.renderCryptoIcons()}
        </div>
        <div className={ this.state.showModal ? "lobby-overlay hide" : "lobby-overlay" }>
          <div className="lobby-register">
            <button onClick={this.toggleModal}>
              <div>
                <div className="btn btnLn-two">
                  <span className="btn-content">New</span>
                </div>
              </div>
            </button>
          </div>
            <GameList allGames={allGames}/>
        </div>
        { this.state.showModal ? modalDiv : null }
      </div>
    );
  }
}

const GameList = ({ allGames }) => {
  // console.log("allGames", allGames );
  // console.log("allGames.size", allGames.size );
  if(allGames && allGames.size < 1) {
    return (
      <div className="live-games">
        <h4 className="no-game-warning">Create a game above to start</h4>
      </div>
    )
  }
  else if (allGames) {
    return <div className="live-games">
      <h3>Live Games</h3>
      <table>
        <thead>
          <tr>
            <th data-field="game">Game Name</th>
            <th data-field="author">Author</th>
            <th data-field="mine">Mines</th>
            <th data-field="size">Size</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(allGames.toJS()).map(hash => {
              const game = allGames.get(hash)
              console.log("game in body", game)
                return (
                  <tr key={hash}>
                    <td className="game-description">
                      <Link to={`/game/${hash}`}>
                        {game.description}
                      </Link>
                    </td>
                    <td>
                      <Jdenticon className="jdenticon middle-align-item" size={30} hash={game.creatorHash}/>
                      <span className="middle-align-item">{game.creatorHash.substring(0,5)}</span>
                    </td>
                    <td>{game.mines.length}</td>
                    <td>{game.size.x} x {game.size.y}</td>
                  </tr>
                ) 
            })
          }
        </tbody>
      </table>
    </div>
  } else {
    return <ul />
  }
}


const mapStateToProps = ({ allGames }) => ({
  allGames
})

export default connect(mapStateToProps)(Lobby);
