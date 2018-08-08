import * as React from 'react';

import {Link} from 'react-router-dom';

import './GameHUD.css';

import LeaderBoard from './LeaderBoard';
import {ChatboxComponents} from './Chatbox';
import store from '../store'

type GameHUDState = {
  collapsed: boolean
}

class GameHUD extends React.Component<any, GameHUDState> {

  constructor(props: any) {
    super(props)
    this.state = {
      collapsed: false
    }
  }

  public render() {
    const currentGame = store.getState().currentGame!
    const collapsedClass = this.state.collapsed ? "collapsed" : ""
    return <div className={"game-hud " + collapsedClass}>
      <div className='banner'>
        <img src='/images/holochain_banner.png' className="banner-img" />
      </div>
      <nav className="game-hud-nav">
        <Link to="/">&larr; Back to lobby</Link>
        <div className="remaining-mines">
          <span>Remaining Mines:</span> {currentGame.matrix.getRemainingMines()}
        </div>
      </nav>
      <div className="leader-board-title">
        SCORES
      </div>
      <LeaderBoard />
      { ChatboxComponents() }
    </div>
  }
}

export default GameHUD;
