import * as React from 'react';
import {connect} from 'react-redux';

import './Cell.css';

import store from '../store'
import {CellMatrix, CellStatus} from '../types'

type CellProps = {
  columnIndex: number,
  rowIndex: number,
  key: number,
  style: any,
}

class Cell extends React.Component<CellProps, {}> {

  public render() {
    const {columnIndex, rowIndex, style} = this.props
    const matrix = store.getState().currentGame!.matrix
    const status: CellStatus = matrix.getIn([rowIndex, columnIndex])
    const statusClass =
      status === CellStatus.Revealed ? "revealed"
      : status === CellStatus.Flagged ? "flagged"
      : ""
    return <div className={"Cell " + statusClass} style={style} onClick={ this.handleReveal({x: columnIndex, y: rowIndex}) } />
  }

  private handleReveal = (coords: XY) => e => {
    store.dispatch({type: 'REVEAL', coords})
    this.forceUpdate()
  }

}

export default Cell;
