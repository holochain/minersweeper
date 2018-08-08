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

  private collapser: React.RefObject<HTMLDivElement> = React.createRef()

  constructor(props) {
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
       {/* <div className="collapser" onClick={this.onCollapse} ref={this.collapser}>
          <img src="/images/chevron-right.svg"/>
        </div>*/}
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

  private onCollapse = (e) => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

}

export default GameHUD;
