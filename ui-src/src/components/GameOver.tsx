import * as React from 'react';
import './GameOver.css';
import { fromJS } from 'immutable';
import * as I from 'immutable';

import { connect } from 'react-redux';

import Jdenticon from './Jdenticon';

import { getDisplayName } from '../common';
import {Hash} from '../holochain';
import {GameBoard, Action} from '../minersweeper';

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
      <h2 {...this.props} className="game-over-title" >GAME OVER</h2>
      <div className="stats-overlay">
        <div className="stats-info">
            <div className="stats-body">
              <WinnersPodium
                scores={this.state.sortedStats.score}
                identities={identities}
                myHash={whoami!.agent_hash}
              />
              <div className="medal-list-container">
                <MedalList
                  sortedStats={this.state.sortedStats}
                  identities={identities}
                  myHash={whoami!.agent_hash}
                />
              </div>
              <div className="circle" />
              <img className="holochain-logo" src="/images/holochain-logo.png"/>
            </div>
        </div>
      </div>
    </div>
  }
}

const WinnersPodium = ({ scores, identities, myHash }) => {
  const top3 = scores.slice(0, 3)
  const myPlace = scores.findIndex((hash, _) => hash === myHash)
  const imaWinner = false
  const winners = top3.map(([hash, score], i) => {
    return <Winner
            key={i}
            agent_hash={hash}
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

const Winner = ({agent_hash, agentName, score, place, isMe}) => {
  const jdenticonSize = 75
  const username = getDisplayName(agent_hash).substring(0,8);
  return (
    <div className={`winner place-${place} ${isMe ? 'me' : ''}`}>
      <div className="username">{ username }</div>
      <Jdenticon className="winner-jdenticon" hash={ agent_hash } size={ jdenticonSize } />
      <div className="score">{ score }</div>
    </div>
  )
}

const MedalList = ({ sortedStats, identities, myHash }) => {
  const titles = {
    streak: 'Longest Streak',
    accuracy: 'Most Accurate',
    mines: 'Most Mines',
    numActions: 'Most Actions',
  }
  const medals = Object.keys(titles).map(name => {
    const title = titles[name]
    const [agentHash, stat] = sortedStats[name][0]
    const agentName = identities.get(agentHash)
    let imaWinner = false
    if (agentHash === myHash) {
      imaWinner = true
    }
    const accuracyStat = Math.floor(sortedStats.accuracy[0][1]).toString();
    const props: MedalProps = {
      agentHash, agentName, stat, accuracyStat, title, imaWinner
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
  accuracyStat: string,
  agentHash: string,
  agentName: string,
  imaWinner: boolean
}

const Medal = (props: MedalProps) => {
  const jdenticonSize = 30
  const {title, stat, accuracyStat, agentHash, agentName, imaWinner} = props
  if (title === "Most Accurate") {
    return <div className="medal">
      <div className="medal-title">{title}</div>
      <Winner
        key={title}
        agent_hash={agentHash}
        agentName={agentName}
        score={`${accuracyStat}%`}
        place={title}
        isMe={imaWinner}/>
    </div>
  }
  else {
    return <div className="medal">
      <div className="medal-title">{title}</div>
      <Winner
        key={title}
        agent_hash={agentHash}
        agentName={agentName}
        score={stat}
        place={title}
        isMe={imaWinner}/>
    </div>
  }
}

const mapStateToProps = ({ currentGame, identities, whoami }) => ({
  currentGame, identities, whoami
})

export default connect(mapStateToProps)(GameOver);
