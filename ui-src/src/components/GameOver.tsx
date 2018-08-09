import * as React from 'react';
import './GameOver.css';
import { connect } from 'react-redux';

import Jdenticon from './Jdenticon';

import {Hash} from '../../../holochain';
import * as common from '../common';
import { getLongestStreak, getFlaggingAccuracy, getMinesClicked, getNumberOfActions, getScores } from '../scoring'

type GameOverState = {
  highestScore: Hash | null,
  longestSteak: Hash | null,
  bestAccuracy: Hash | null,
  mostMinesClicked: Hash | null,
  mostActions: Hash | null
}

class GameOver extends React.Component<any, GameOverState> {
  constructor(props) {
     super(props);
     this.state = {
        highestScore: null,
        longestSteak: null,
        bestAccuracy: null,
        mostMinesClicked: null,
        mostActions: null
     }
   }

  public componentDidMount() {
    const { identities, currentGame } = this.props
    //setstate with new score stats:
    identities.forEach(player => {
      const {highestScore, longestSteak, bestAccuracy, mostMinesClicked, mostActions} = this.state
      const stats = []
      const score = getScores(player)
      const streak = getLongestStreak(player)
      const accuracy = getFlaggingAccuracy(player)
      const mines = getMinesClicked(player)
      const actions = getNumberOfActions(player)
      stats.push(score, streak, accuracy, mines, actions)

      stats.forEach(stat => {
        switch (stat) {
          case score :
            if (score > highestScore) {
              this.setState({hightestScore:player})
            }
            break;
          case streak:
            if (score > longestSteak) {
              this.setState({longestSteak:player})
            }
            break;
          case accuracy:
            if (score > bestAccuracy) {
              this.setState({bestAccuracy:player})
            }
            break;
          case mines:
            if (score > mostMinesClicked) {
              this.setState({mostMinesClicked:player})
            }
            break;
          case actions:
            if (score > mostActions) {
              this.setState({mostActions:player})
            }
            break;
          default:
            break;
          }
          return stats;
        })
      });
      console.log("this.state", this.state);
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
              <GameList winners={this.state.winners}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

const GameList = ({ currentGame }) => {
  if(!currentGame) {
    return (
      <div className="stats-table">
        <h4 className="no-stats-warning">Please return to the lobby to begin again!</h4>
      </div>
    )
  }
  else if (currentGame) {
    return <div className="stats-table">
      <h3 className="stats-header">Live Games</h3>
      <table>
        <thead>
          <tr>
            <th className="author">Author</th>
            <th className="stats">Stats</th>
            <th className="medal">Medal</th>
          </tr>
        </thead>
        <tbody>
          {this.props.winners.forEach(winnerType => {
              console.log(winnerType);
              {/* const winner = store.getState().identities.get(agentHash)
              return <tr key={winnerType}>
                <td className="author">
                  <Jdenticon style={{marginRight: 3}} className="middle-align-item" size={30} hash={agentHash}/>
                  <span className="middle-align-item">{author}</span>
                </td>
                <td className="stats"/>
                <td className="medal"/>
              </tr> */}
          })}
        </tbody>
      </table>
    </div>
  } else {
    return <ul />
  }
}

const mapStateToProps = ({ currentGame, identities }) => ({
  currentGame, identities
})

export default connect(mapStateToProps)(GameOver);
