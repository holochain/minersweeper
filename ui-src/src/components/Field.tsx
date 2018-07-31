import * as React from 'react';
import './Field.css';

import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { AutoSizer, Grid } from 'react-virtualized';

import {Hash} from '../../../holochain';

import Cell from './Cell';
import CellMatrix from '../CellMatrix';


// from https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md#overscanindicesgetter
function overscanIndicesGetter ({
  direction,          // One of "horizontal" or "vertical"
  cellCount,          // Number of rows or columns in the current axis
  scrollDirection,    // 1 (forwards) or -1 (backwards)
  overscanCellsCount, // Maximum number of cells to over-render in either direction
  startIndex,         // Begin of range of visible cells
  stopIndex           // End of range of visible cells
}) {
  return {
    overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
    overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
  }
}

type FieldProps = {
  gameHash: Hash,
  matrix: CellMatrix
}

class Field extends React.Component<FieldProps, {}> {

  // public shouldComponentUpdate(nextProps, _, __) {
  //   if (this.grid !== null) {
  //     this.grid!.forceUpdate()
  //   }
  //   return true
  // }

  public render() {
    const columns = this.props.matrix.size.x
    const rows = this.props.matrix.size.y
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
          overscanColumnCount={20}
          overscanRowCount={20}
          overscanIndicesGetter={overscanIndicesGetter}
          XXXscrollingResetTimeInterval={10}
        />
      }</AutoSizer>
    )
  }

  private CellWrapped = (props) => (<Cell gameHash={this.props.gameHash} key={props.key} {...props}/>)
}

const mapStateToProps = state => ({
  matrix: state.currentGame.matrix,
})

export default connect(mapStateToProps)(Field);
