import * as React from 'react';
import {connect} from 'react-redux';

import './Cell.css';

import store from '../store'
import {CellMatrix, CellStatus, XY} from '../types'

type CellProps = {
  columnIndex: number,
  rowIndex: number,
  key: number,
  style: any,
}

const handleReveal = (coords: XY) => e => store.dispatch({type: 'REVEAL', coords})

const Cell = ({columnIndex, key, rowIndex, style}: CellProps) => {
  const matrix = store.getState().currentGame!.matrix
  const status: CellStatus = matrix.getIn([rowIndex, columnIndex])
  const statusClass =
    status === CellStatus.Revealed ? "revealed"
    : status === CellStatus.Flagged ? "flagged"
    : ""
  return <div key={key} className={"Cell " + statusClass} style={style} onClick={ handleReveal({x: columnIndex, y: rowIndex}) } />
}

export default Cell;
