import * as React from 'react';
import {connect} from 'react-redux';

import {Action, ActionType, GameParams, MoveDefinition, XY} from '../../../minesweeper'

import './Cell.css';

import {Hash} from '../../../holochain';

import Jdenticon from './Jdenticon';

import CellMatrix from '../CellMatrix';
import {fetchJSON, CELL_SIZE} from '../common'
import store from '../store'

type CellProps = {
  columnIndex: number,
  gameHash: Hash,
  rowIndex: number,
  style: any,
  myActions: number,
}

class Cell extends React.Component<CellProps, {}> {
}

export default connect(state => ({myActions: state.myActions}))(Cell);
