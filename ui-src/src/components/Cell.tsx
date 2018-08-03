import * as React from 'react';
import {connect} from 'react-redux';

import {Action, ActionType, GameParams, MoveDefinition, XY} from '../../../minesweeper'

import './Cell.css';

import {Hash} from '../../../holochain';

import Jdenticon from './Jdenticon';

import CellMatrix from '../CellMatrix';
import {fetchJSON, CELL_SIZE, DEBUG_MODE} from '../common'
import store from '../store'

type CellProps = {
  columnIndex: number,
  gameHash: Hash,
  rowIndex: number,
  style: any,
  myActions: number,
}

class Cell extends React.Component<CellProps, {}> {

  public render() {
    const {matrix, gameHash} = store.getState().currentGame!
    const {style} = this.props
    const pos = this.getPos()

    if (!matrix.isInBounds(pos.x, pos.y)) {
      // empty out-of-bound cells to create the margin
      return <div />
    }

    const numAdjacent = matrix.getAdjacentMines(pos)
    const flag = matrix.getFlag(pos)
    const isMine = matrix.isMine(pos)
    const isRevealed = matrix.isRevealed(pos)

    const isRevealedMine = isRevealed && isMine && !flag
    const isNumber = numAdjacent > 0
    const isCorrectFlag = flag && isMine
    const isFalseFlag = flag && !isMine

    const revealedClass = isRevealed ? "revealed" : ""
    const mineClass = isMine && (isRevealed || DEBUG_MODE) ? "mine" : ""

    const mistakeClass = (isRevealedMine || isFalseFlag) ? "mistake" : ""

    const numberClass =
      numAdjacent > 0 ? `num-${numAdjacent}` : ""


    let content: JSX.Element | null = null
    if (isRevealedMine) {
      content = <img src="/images/dogecoin.png"/>
    } else if (isCorrectFlag) {
      content = <Jdenticon size={CELL_SIZE - 2} hash={flag} />
    } else if ((isRevealed || flag) && isNumber) {
      content = <span className={`number ${numberClass}`}>{ numAdjacent }</span>
    }

    return <div
      className={`Cell ${revealedClass} ${mineClass} ${numberClass} ${mistakeClass}`}
      style={style}
      onClick={ this.handleReveal }
      onContextMenu={ this.handleFlag }
    >
      { content }
    </div>
  }

  private getPos = () => {
    const {columnIndex, rowIndex} = this.props
    return {x: columnIndex, y: rowIndex}
  }

  private handleMove = (type, actionType) => {
    const pos = this.getPos()
    const {matrix} = store.getState().currentGame!
    if ((actionType === "flag" || actionType === "reveal") && (matrix.isRevealed(pos) || matrix.isFlagged(pos))) {
      // can't flag or reveal a revealed square
      return;
    }
    store.dispatch({type, coords: pos})
    this.forceUpdate()
    const payload: MoveDefinition = {
      gameHash: this.props.gameHash,
      action: {
        actionType,
        position: pos,
      }
    }
    fetchJSON('/fn/minersweeper/makeMove', payload).then(ok => {
      console.log('makeMove: ', pos, ok)
      // TODO: show score if ok
    })
  }

  private handleReveal = e => {
    e.preventDefault()
    const pos = this.handleMove('QUICK_REVEAL', 'reveal')
  }

  private handleFlag = e => {
    e.preventDefault()
    const pos = this.handleMove('QUICK_FLAG', 'flag')
  }
}

// TODO: check for performance?
export default connect(state => ({myActions: state.myActions}))(Cell);
