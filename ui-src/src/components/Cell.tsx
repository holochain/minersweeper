import * as React from 'react';
import {connect} from 'react-redux';

import {Action, ActionType, GameParams, MoveDefinition, XY} from '../../../minesweeper'

import './Cell.css';

import {Hash} from '../../../holochain';

import CellMatrix from '../CellMatrix';
import {fetchJSON} from '../common'
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
    const actionClass =
      matrix.isRevealed(pos) ? "revealed"
      : matrix.isFlagged(pos) ? "flagged"
      : ""

    const numAdjacent = matrix.getAdjacentMines(pos)
    const content = matrix.isRevealed(pos) &&
      ( matrix.isMine(pos)
      ? <img src="/images/dogecoin.png"/>
      : numAdjacent > 0
      ? <span className="number">{ numAdjacent }</span>
      : null )

    return <div
      className={`Cell ${actionClass}`}
      style={style}
      onClick={ this.handleReveal }
    >
      { content }
    </div>
  }

  private getPos = () => {
    const {columnIndex, rowIndex} = this.props
    return {x: columnIndex, y: rowIndex}
  }

  private handleReveal = e => {
    const pos = this.getPos()
    store.dispatch({type: 'QUICK_REVEAL', coords: pos})
    this.forceUpdate()
    const payload: MoveDefinition = {
      gameHash: this.props.gameHash,
      action: {
        actionType: "reveal",
        position: pos,
      }
    }
    fetchJSON('/fn/minersweeper/makeMove', payload).then(ok => {
      console.log('makeMove: ', pos, ok)
      // TODO: show score if ok
    })
  }

}

// TODO: check for performance?
export default connect(state => ({myActions: state.myActions}))(Cell);
