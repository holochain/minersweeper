import { Set } from 'immutable';
import * as React from 'react';
import { Link } from 'react-router-dom';
import './Lobby.css';

import { Hash } from '../../../holochain'
import { connect } from 'react-redux';

import Jdenticon from './Jdenticon';

import * as common from '../common';

import CreateGameForm from './CreateGameForm'

type LobbyState = {
  showModal: boolean,
}

class Lobby extends React.Component<any, LobbyState> {
  public cryptoIcons = ["btc", "eth", "xmr", "ltc", "doge", "drgn", "bcc", "kmd", "dbc", "elix", "mkr", "powr", "xvg", "zec", "huc", "tel", "pot", "pay", "ox", "nxs", "nmc", "lrc"];

  private updateLobbyInterval: any = null

  constructor(props: any) {
     super(props);
     this.state = {
       showModal: false,
     }
     this.toggleModal = this.toggleModal.bind(this);
   }

  public componentWillMount() {
    const updateLobby = () => {
      common.fetchCurrentGames().then(games => {
        const creators = games.map(([_, game]) => game.creatorHash)
        common.fetchIdentities(Set(creators))
      })
    }
    updateLobby()
    this.updateLobbyInterval = setInterval(
      updateLobby, common.FETCH_LOBBY_INTERVAL
    )
  }

  public componentWillUnmount() {
    clearInterval(this.updateLobbyInterval)
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

  public render() {
    const {allGames, identities} = this.props
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
      <div className="splash-screen-page">
        <div className="screen">
          <div className="Lobby">
            <div className="lobby-jumbotron">
              <h1 className="lobby-header">Welcome to Minersweeper</h1>
            </div>
          </div>
          <div className="coins">
            {this.renderCryptoIcons()}
          </div>
        </div>
        <div className={ this.state.showModal ? "lobby-overlay hide" : "lobby-overlay" }>
          <div className="lobby-register" onClick={this.toggleModal}>
            <div>
              <div className="btn btnLn-two">
                <span className="btn-content">New</span>
              </div>
            </div>
          </div>
          <GameList allGames={allGames} identities={identities}/>
        </div>
        { this.state.showModal ? modalDiv : null }
      </div>
    );
  }
}

const GameList = ({ allGames, identities }) => {
  if(allGames && allGames.size < 1) {
    return (
      <div className="live-games">
        <h4 className="no-game-warning">Create a game above to start</h4>
      </div>
    )
  }
  else if (allGames) {
    return <div className="live-games">
      <h3 className="live-games-header">Live Games</h3>
      <table>
        <thead>
          <tr>
            <th className="author">Author</th>
            <th className="mine">Mines</th>
            <th className="size">Size</th>
            <th className="game-title">Game Name</th>
            <th className="play"/>
          </tr>
        </thead>
        <tbody>
          {
            allGames.keySeq().map((hash: Hash) => {
              const game = allGames.get(hash)
              const {creatorHash, mines, size} = game
              let author = (
                identities.get(creatorHash)
                || creatorHash
              )
              const truncatedAuthor = author.substring(0,15)
              if (author !== truncatedAuthor) {
                author = truncatedAuthor + '...'
              }
              return <tr key={hash}>
                <td className="author">
                  <Jdenticon style={{marginRight: 3}} className="middle-align-item" size={30} hash={creatorHash}/>
                  <span className="middle-align-item">{author}</span>
                </td>
                <td className="mine">{mines.length}</td>
                <td className="size">{size.x} x {size.y}</td>
                <td className="game-title">
                  {game.description}
                </td>
                <td className="play">
                  <Link to={`/game/${hash}`}>
                    <button className="play-button">Play</button>
                  </Link>
                </td>
              </tr>
            }).toJS()
          }
        </tbody>
      </table>
    </div>
  } else {
    return <ul />
  }
}


const mapStateToProps = ({ allGames, identities }) => ({
  allGames, identities
})

export default connect<any, any, any>(mapStateToProps)(Lobby);
