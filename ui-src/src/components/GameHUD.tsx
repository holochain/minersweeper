import * as React from 'react';
import './GameHUD.css';

import Chatbox from './Chatbox';
import store from '../store'


class GameHUD extends React.Component<any, {}> {

  public render() {
    return <div className="game-hud">
      <div>
        <span>Remaining Mines: {store.getState().currentGame!.matrix.getRemainingMines()}</span>
      </div>
      <div className="game-leaderboard">
        {"leaderboard here"}
      </div>
      <div className="game-chat">
        <Chatbox/>
      </div>
    </div>
  }
}

export default GameHUD;
