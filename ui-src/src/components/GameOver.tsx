import * as React from 'react';
import './GameOver.css';
import { fromJS } from 'immutable';
import * as I from 'immutable';

import { connect } from 'react-redux';

import Jdenticon from './Jdenticon';

import {Hash} from '../../../holochain';
import {GameBoard, Action} from '../../../minersweeper';

import * as common from '../common';
import { getLongestStreak, getFlaggingAccuracy, getMinesClicked, getNumberOfActions, getScores } from '../scoring'

type PlayerStats<T> = {
  score: T,
  streak: T,
  accuracy: T,
  mines: T,
  numActions: T
}

type GameOverState = {
  topStats: PlayerStats<[Hash, number]>,
  myStats: PlayerStats<number>
} | {}

type StatsMap = Map<Hash, number>
type StatsFunc = (gameBoard: GameBoard, actions: Action[]) => StatsMap

class GameOver extends React.Component<any, GameOverState> {
  constructor(props) {
    super(props);
    this.state = {}
  }

  public componentDidMount() {
    const { identities, currentGame, whoami } = this.props
    const { gameHash, gameBoard } = currentGame!
    common.fetchActions(gameHash).then(actions => {
      const everything: Array<[string, StatsFunc]> = [
        ['score', getScores],
        ['streak', getLongestStreak],
        ['accuracy', getFlaggingAccuracy],
        ['mines', getMinesClicked],
        ['numActions', getNumberOfActions],
      ]
      const state: any = {topStats: {}, myStats: {}}
      everything.forEach(pair => {
        const name = pair[0]
        const getter = pair[1]
        const stats: StatsMap = getter(gameBoard, actions)
        let highest = 0
        let winner: Hash | null = null
        let own = 0
        for (const [agentHash, value] of stats) {
          if (value > highest) {
            highest = value
            winner = agentHash
          }
          if (agentHash === whoami!.agentHash) {
            own = value
          }
        }
        state.topStats[name] = [winner, highest]
        state.myStats[name] = own
      })
      this.setState(state)
    })
  }

  public render() {
    return <div className="game-over">
      <h2 {...this.props} className="game-over-title" >Game Over</h2>
      <div className="stats-overlay">
        <div className="stats-info">
          <div>
            <div className="stats-jumbotron">
              <h1 className="stats-header">Game Stats</h1>
            </div>
            <div className="stats-body">
              <h4>The List of Stats Go Here</h4>
              {/* <GameList winners={this.state.winners}/> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}
//
// const GameList = ({ currentGame }) => {
//   if(!currentGame) {
//     return (
//       <div className="stats-table">
//         <h4 className="no-stats-warning">Please return to the lobby to begin again!</h4>
//       </div>
//     )
//   }
//   else if (currentGame) {
//     return <div className="stats-table">
//       <h3 className="stats-header">Live Games</h3>
//       <table>
//         <thead>
//           <tr>
//             <th className="author">Author</th>
//             <th className="stats">Stats</th>
//             <th className="medal">Medal</th>
//           </tr>
//         </thead>
//         <tbody>
//           {this.props.winners.forEach(winnerType => {
//               console.log(winnerType);
//               {/* const winner = store.getState().identities.get(agentHash)
//               return <tr key={winnerType}>
//                 <td className="author">
//                   <Jdenticon style={{marginRight: 3}} className="middle-align-item" size={30} hash={agentHash}/>
//                   <span className="middle-align-item">{author}</span>
//                 </td>
//                 <td className="stats"/>
//                 <td className="medal"/>
//               </tr> */}
//           })}
//         </tbody>
//       </table>
//     </div>
//   } else {
//     return <ul />
//   }
// }

const mapStateToProps = ({ currentGame, identities, whoami }) => ({
  currentGame, identities, whoami
})

export default connect(mapStateToProps)(GameOver);
