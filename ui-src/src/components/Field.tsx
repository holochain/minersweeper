import * as React from 'react';
import './Field.css';

import {connect} from 'react-redux';
import { AutoSizer, Grid } from 'react-virtualized';

import Cell from './Cell';

import {CellMatrix, GameParams, XY} from '../types';


class Field extends React.Component<{matrix: CellMatrix}, {}> {

  private grid: Grid = null

  public shouldComponentUpdate(nextProps, _, __) {
    if (this.grid !== null) {
      this.grid!.forceUpdate()
    }
    return true
  }

  public render() {
    const rows = this.props.matrix.size
    const columns = this.props.matrix.get(0).size
    const cellSize = 20

    return (
      <AutoSizer>{
        ({width, height}) => <Grid
          ref={el => this.grid = el}
          cellRenderer={Cell}
          columnCount={columns}
          columnWidth={cellSize}
          height={height}
          xxxOverscanColumnCount={10}
          xxxOverscanRowCount={10}
          rowCount={rows}
          rowHeight={cellSize}
          width={width}
        />
      }</AutoSizer>
    )
  }

}

const mapStateToProps = state => ({
  matrix: state.game.matrix,
  myActions: state.game.myActions,
})

export default connect(mapStateToProps)(Field);
