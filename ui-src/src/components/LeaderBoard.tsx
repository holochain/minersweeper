import * as React from 'react';
import {connect} from 'react-redux';
import {Hash} from "../../../holochain";
import {Map, fromJS} from 'immutable';

import './LeaderBoard.css';

import store from '../store';
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
          <LeaderItem hash={agentHash} handle={agentHandler} score={agentScore} />
        )
      })
    }

    // Change the user hash into user name
    return (
      <div className="leader-board">
        <h3 className="title">scores</h3>
        <table className="leader-board-table">
          <tbody>
            {displayBoard}
          </tbody>
        </table>
        <div
          className="temporary-big-space-TODO-remove-me"
          style={{marginBottom: 50}}
        />
      </div>
    )
  }
}

const LeaderItem = ({hash, handle, score}) => {
  return <tr>
    <td className="player">
      <span className="handle">{ handle }</span>
      <Jdenticon class="jdenticon" size={25} hash={ hash } />
    </td>
    <td className="score">{ score }</td>
  </tr>
}

const mapStateToProps = gameState => ({
  scores: gameState.currentGame.scores,
  allPlayerHandles: gameState.identities,
})

export default connect(mapStateToProps)(LeaderBoard);



// WEBPACK FOOTER //
// ./ui-src/src/components/LeaderBoard.tsx
