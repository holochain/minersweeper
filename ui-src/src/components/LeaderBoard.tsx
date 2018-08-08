import * as React from 'react';
import {connect} from 'react-redux';
import {Hash} from "../../../holochain";
import {Map} from 'immutable';

import './LeaderBoard.css';

import {StoreState} from '../types';
import Jdenticon from './Jdenticon';

type LeaderBoardProps = {
  scores: Map<Hash, number>,
  allPlayerHandles: Map<Hash, string>,
}

class LeaderBoard extends React.Component<LeaderBoardProps, {}> {

  public render () {
    // Fetch the score
    const {scores, allPlayerHandles} = this.props

    const displayBoard:any[] = []

    if(scores !== null && allPlayerHandles.size !== 0) {
      const descending = (a:number, b:number) => {
        if (a < b) { return 1; }
        if (a > b) { return -1; }
        if (a === b) { return 0; }
        return 0;
      }

      scores.sort(descending).forEach((agentScore:number, agentHash:Hash) => {
        const agentHandler:string = allPlayerHandles.get(agentHash!)
        displayBoard.push(
          <LeaderItem key={agentHash} hash={agentHash} handle={agentHandler} score={agentScore} />
        )
      })
    }

    // Change the user hash into user name
    return (
      <div className="game-leaderboard leader-board">
        <table className="leader-board-table">
          <tbody>
            {displayBoard}
          </tbody>
        </table>
      </div>
    )
  }
}

const LeaderItem = ({hash, handle, score}) => {
  return <tr>
    <td className="score">{ score }</td>
    <td className="player">
      <Jdenticon className="jdenticon" size={25} hash={ hash } />
      <span className="handle">{ handle }</span>
    </td>
  </tr>
}

const mapStateToProps = (gameState: StoreState) => ({
  scores: gameState.currentGame!.scores,
  allPlayerHandles: gameState.identities,
})

export default connect<any, any, any>(mapStateToProps)(LeaderBoard);
