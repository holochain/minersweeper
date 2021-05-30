import * as React from 'react';
import {connect} from 'react-redux';
import { Grid } from 'react-virtualized';

import { MoveDefinition, BoardActionType, Pos} from '../../../minersweeper'

import './Cell.css';

import {Hash} from '../../../holochain';

import Jdenticon from './Jdenticon';

import * as common from '../common'
import store from '../store'
import {StoreState} from '../types'

type CellProps = {
  columnIndex: number,
  gameHash: Hash,
  rowIndex: number,
  style: any,
  parent: Grid,
  myActions: number,
}

type CellState = {
  animating: boolean
}

class Cell extends React.Component<CellProps, CellState> {

  constructor(props: CellProps) {
    super(props)
    this.state = {
      animating: false
    }
  }

  public render() {
    const {matrix} = store.getState().currentGame!
    const {style} = this.props
    const pos = this.getPos()

    if (!matrix.isInBounds(pos.x, pos.y)) {
      // empty out-of-bound cells to create the margin
      return <div style={style} className="buffer-cell"/>
    }

    const numAdjacent = matrix.getAdjacentMines(pos)
    const flag = matrix.getFlag(pos)
    const isMine = matrix.isMine(pos)
    const isRevealed = matrix.isRevealed(pos)

    const isRevealedMine = isRevealed && isMine
    const isNumber = (isRevealed || flag) && numAdjacent > 0
    const isCorrectFlag = flag && isMine
    const isFalseFlag = flag && !isMine

    const revealedClass = isRevealed ? "revealed" : ""
    const mineClass = isMine && (isRevealed || common.DEBUG_MODE) ? "mine" : ""

    const mistakeClass = (isRevealedMine || isFalseFlag) ? "mistake" : ""

    const numberClass =
      numAdjacent > 0 ? `num-${numAdjacent}` : ""

    const animatingClass =
      this.state.animating ? 'animating' : ''

    let content: JSX.Element | null = null
    if (isRevealedMine) {
      const mineIcon = common.getIconFromPos(pos)
      content = <img src={mineIcon} className="mine-icon"/>
    } else if (isCorrectFlag) {
      content = <Jdenticon size={common.CELL_SIZE - 2} hash={flag} />
    } else if (isNumber) {
      content = <span className={`number ${numberClass}`}>{ numAdjacent }</span>
    }

    const handleLeftClick = isNumber ? this.handleAutoReveal : this.handleReveal
    const handleRightClick = isNumber ? this.handleAutoReveal : this.handleFlag

    return <div
      className={`Cell ${revealedClass} ${mineClass} ${numberClass} ${mistakeClass} ${animatingClass}`}
      style={style}
      onClick={ handleLeftClick }
      onContextMenu={ handleRightClick }
    >
      { content }
    </div>
  }

  private handleReveal = (e: React.SyntheticEvent) => {
    e.preventDefault()
    this.handleMove('reveal')
  }

  private handleFlag = (e: React.SyntheticEvent) => {
    e.preventDefault()
    this.handleMove('flag')
  }

  private handleAutoReveal = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const pos = this.getPos()
    const {matrix} = store.getState().currentGame!

    // XXX: modifying state outside of a reducer!!!
    const reveals = matrix.autoReveal(pos)

    this.redrawNeighborhood()

    reveals.forEach(revealPos => {
      this.makeMove('reveal', revealPos)
    })
  }

  private getPos = () => {
    const {columnIndex, rowIndex} = this.props
    return {x: columnIndex, y: rowIndex}
  }

  private handleMove = (actionType: BoardActionType) => {
    const pos = this.getPos()
    const {currentGame, whoami} = store.getState()
    const {matrix} = currentGame!
    if ((actionType === "flag" || actionType === "reveal") && (matrix.isRevealed(pos) || matrix.isFlagged(pos))) {
      // can't flag or reveal a revealed square
      return;
    }


    // XXX: modifying state outside of a reducer!!!
    const numRevealed = matrix.takeAction({
      action_type: actionType,
      position: pos,
      agent_hash: "", // whoami!.agent_hash,
      timestamp: -1,  // kinda doesn't matter...
    })

    if (numRevealed > 1) {
      this.redrawNeighborhood()
    } else {
      this.forceUpdate()
    }
    this.makeMove(actionType, pos)
  }

  private makeMove = (actionType, position: Pos) => {
    const payload: MoveDefinition = {
      game_hash: this.props.gameHash,
      action: {action_type: actionType, position}
    }

    // give it 2 seconds to animate
    this.setState({animating: true})
    setTimeout(() => this.setState({animating: false}), 2000)

    // common.fetchJSON('/fn/minersweeper/makeMove', payload).then(ok => {
    common.enqueueAction(payload)
  }

  private redrawNeighborhood = () => {
    // inefficient but effective way to force redraw neighbors
    // (and most of the rest of the screen as well...)
    this.props.parent.recomputeGridSize({
      columnIndex: Math.max(0, this.props.columnIndex - 4),
      rowIndex: Math.max(0, this.props.rowIndex - 4),
    })
  }
}

// TODO: check for performance?
export default connect((state: StoreState) => ({myActions: state.myActions}))(Cell);
