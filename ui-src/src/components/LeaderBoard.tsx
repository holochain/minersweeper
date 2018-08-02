import * as React from 'react';
import {connect} from 'react-redux';
import {Hash} from "../../../holochain";
import {Map} from 'immutable';

import store from '../store';
import Jdenticon from './Jdenticon';

type LeaderBoardProps = {
  scores: Map<Hash, number>,
}

class LeaderBoard extends React.Component<LeaderBoardProps, {}> {

  public render () {
    // Fetch the score
    const {scores} = this.props



    // Change the user hash into user name
    return (
    <div>
      {scores}
    </div>
    )
  }
}

const mapStateToProps = state => ({
  scores: state.currentGame.scores,
})

export default connect(mapStateToProps)(LeaderBoard);



// WEBPACK FOOTER //
// ./ui-src/src/components/LeaderBoard.tsx
