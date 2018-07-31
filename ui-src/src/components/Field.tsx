import * as React from 'react';
import './Field.css';

import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { AutoSizer, Grid } from 'react-virtualized';

import Cell from './Cell';

import {CellMatrix} from '../types';


class Field extends React.Component<{matrix: CellMatrix}, {}> {

  // public shouldComponentUpdate(nextProps, _, __) {
  //   if (this.grid !== null) {
  //     this.grid!.forceUpdate()
  //   }
  //   return true
  // }

  public render() {
    const rows = this.props.matrix.size
    const columns = this.props.matrix.get(0).size
    const cellSize = 26

    return (
      <AutoSizer>{
        ({width, height}) => <Grid
          cellRenderer={this.CellWrapped}
          columnCount={columns}
          columnWidth={cellSize}
          height={height}
          isScrollingOptOut={true}
          rowCount={rows}
          rowHeight={cellSize}
          width={width}

          XXXoverscanColumnCount={10}
          XXXoverscanRowCount={10}
          XXXscrollingResetTimeInterval={10}
        />
      }</AutoSizer>
    )
  }

  private CellWrapped = (props) => (<Cell key={props.key} {...props}/>)
}

const mapStateToProps = state => ({
  matrix: state.currentGame.matrix,
})

export default connect(mapStateToProps)(Field);
