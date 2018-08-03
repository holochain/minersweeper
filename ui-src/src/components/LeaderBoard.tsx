import * as React from 'react';
import {connect} from 'react-redux';
import {Hash} from "../../../holochain";
import {Map, fromJS} from 'immutable';
import {fetchIdentities} from '../common'

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

    const tempUserScoreMap:any[] = []
    // Fetch the identity
    if(scores !== null) {
      scores.forEach((agentScore:number, agentHash:Hash) => {
        const agentHandler:string = allPlayerHandles.get(agentHash!)
        tempUserScoreMap.push([agentHandler, agentScore])
      })
    }

    const sortedUserScoreMap = fromJS(tempUserScoreMap).sort((a, b) => {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      if (a === b) { return 0; }
    });

    // Change the user hash into user name
    return (
    <div>
      {sortedUserScoreMap}
    </div>
    )
  }
}

const mapStateToProps = state => ({
  scores: state.currentGame.scores,
  allPlayerHandles: state.identities,
})

export default connect(mapStateToProps)(LeaderBoard);



// WEBPACK FOOTER //
// ./ui-src/src/components/LeaderBoard.tsx
