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

type PlayerStats = {
  score: StatsList,
  streak: StatsList,
  accuracy: StatsList,
  mines: StatsList,
  numActions: StatsList
}

type StatsList = Array<[Hash, number]>

type GameOverState = {
  sortedStats: PlayerStats
} | null

type StatsMap = Map<Hash, number>
type StatsFunc = (gameBoard: GameBoard, actions: Action[]) => StatsMap

class GameOver extends React.Component<any, GameOverState> {
  constructor(props) {
    super(props);
    this.state = null
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
      const sortedStats: PlayerStats = {
        score: [],
        streak: [],
        accuracy: [],
        mines: [],
        numActions: []
      }
      everything.forEach(([name, getter]) => {
        const stats: StatsMap = getter(gameBoard, actions)
        sortedStats[name] = [...stats.entries()].sort((a, b) => b[1] - a[1])
      })
      this.setState({sortedStats})
    })
  }

  public render() {
    const { identities, whoami } = this.props
    return !this.state ? <div/> : <div className="game-over">
      <h2 {...this.props} className="game-over-title" >Game Over</h2>
      <div className="stats-overlay">
        <div className="stats-info">
          <div>
            <div className="stats-jumbotron">
              <h1 className="stats-header">Game Stats</h1>
            </div>
            <div className="stats-body">
              <h4>The List of Stats Go Here</h4>
              <WinnersPodium
                scores={this.state.sortedStats.score}
                identities={identities}
                myHash={whoami!.agentHash}
              />
              <MedalList sortedStats={this.state.sortedStats} identities={identities}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}


const WinnersPodium = ({ scores, identities, myHash }) => {
  const top3 = scores.slice(0, 3)
  const myPlace = scores.findIndex((hash, _) => hash === myHash)
  const imaWinner = myPlace < 3

  const winners = top3.map(([hash, score], i) => {
    return <Winner
            key={i}
            agentHash={hash}
            agentName={identities.get(hash)}
            score={score}
            place={i + 1}
            isMe={imaWinner}
          />
  })

  return (
    <div className="winners-podium">
      { winners }
    </div>
  )
}

const Winner = ({agentHash, agentName, score, place, isMe}) => {
  const jdenticonSize = 40
  return (
    <div className={`winner place-${place} ${isMe ? 'me' : ''}`}>
      <Jdenticon hash={agentHash} size={jdenticonSize} /> { agentName } : { score }
    </div>
  )
}

const MedalList = ({ sortedStats, identities }) => {
  const titles = {
    streak: 'Longest streak',
    accuracy: 'Most accurate',
    mines: 'Most mines',
    numActions: 'Most actions',
  }
  const medals = Object.keys(titles).map(name => {
    const title = titles[name]
    const [agentHash, stat] = sortedStats[name][0]
    const agentName = identities.get(agentHash)
    const props: MedalProps = {
      agentHash, agentName, stat, title
    }
    return <Medal key={name} {...props} />
  })
  return (
    <div className="medals-list">
      { medals }
    </div>
  )
}

type MedalProps = {
  title: string,
  stat: number,
  agentHash: string,
  agentName: string
}

const Medal = (props: MedalProps) => {
  const jdenticonSize = 30
  const {title, stat, agentHash, agentName} = props
  return <div className="medal">
    <Jdenticon hash={agentHash} size={jdenticonSize} />
    {title}
    {agentName}
    {stat}
  </div>
}

const mapStateToProps = ({ currentGame, identities, whoami }) => ({
  currentGame, identities, whoami
})

export default connect(mapStateToProps)(GameOver);
