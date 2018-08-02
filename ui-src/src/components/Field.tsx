import * as React from 'react';
import './Field.css';

import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { AutoSizer, Grid } from 'react-virtualized';

import {Hash} from '../../../holochain';

import Cell from './Cell';
import CellMatrix from '../CellMatrix';

import {
  CELL_SIZE,
  FETCH_ACTIONS_INTERVAL,
  MARGIN_CELLS,
  fetchCurrentGames,
  fetchJSON
} from '../common';
import store from '../store';


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
  matrix: CellMatrix,
  myActions: number  // NB: dumb hack to ensure updates
}

class Field extends React.Component<FieldProps | any, {}> {

  private grid = React.createRef()
  private panKeys: any = {}
  private actionsInterval: any = null

  constructor(props) {
    super(props)
    // this.state {
    //   panKeys: false
    // }
  }

  public shouldComponentUpdate(nextProps, nextState) {
    return !this.panKeys
  }

  public componentWillUnmount() {
    clearInterval(this.actionsInterval)
  }

  public componentWillMount() {
    this.startPolling()
    const offsets = {
      37: {x: -1, y: 0},
      38: {x: 0, y: -1},
      39: {x: 1, y: 0},
      40: {x: 0, y: 1},
    }
    window.addEventListener('keydown', e => {
      const code = e.keyCode
      if (this.panKeys[code]) {
        return
      }
      this.stopPolling()
      const offset = offsets[code]
      const speed = CELL_SIZE
      this.panKeys[code] = setInterval(
        () => {
          const grid : any = this.grid.current!
          const container = grid._scrollingContainer
          if (offset) {
            // container.scrollLeft += offset.x * speed
            // container.scrollTop += offset.y * speed
            const x = container.scrollLeft + offset.x * speed
            const y = container.scrollTop + offset.y * speed
            grid.scrollToPosition({scrollLeft: x, scrollTop: y})
          }

        }, 10
      )
    })
    window.addEventListener('keyup', e => {
      const code = e.keyCode
      clearInterval(this.panKeys[code])
      this.panKeys[code] = null
      if (Object.keys(this.panKeys).some(k => this.panKeys[k])) {
        this.startPolling()
      }
    })
  }

  public render() {
    console.log('render')
    const columns = this.props.matrix.size.x
    const rows = this.props.matrix.size.y
    const cellSize = CELL_SIZE

    return (
      <div className="field-container">
        <AutoSizer>{
          ({width, height}) => <Grid
            ref={ this.grid }
            cellRenderer={this.CellWrapped}
            columnCount={columns + MARGIN_CELLS * 2}
            rowCount={rows + MARGIN_CELLS * 2}
            columnWidth={cellSize}
            rowHeight={cellSize}
            height={height}
            isScrollingOptOut={true}
            tabIndex={null}
            width={width}
            overscanColumnCount={20}
            overscanRowCount={20}
            overscanIndicesGetter={overscanIndicesGetter}
            XXXscrollingResetTimeInterval={10}
          />
        }</AutoSizer>
      </div>
    )
  }

  private CellWrapped = ({key, columnIndex, rowIndex, ...props}) => (
    <Cell
      myActions={this.props.myActions}
      gameHash={this.props.gameHash}
      key={key}
      columnIndex={columnIndex - MARGIN_CELLS}
      rowIndex={rowIndex - MARGIN_CELLS}
      {...props}/>
   )


  private startPolling() {
    const hash = this.props.gameHash
    if (hash) {
      const fetchActions = () => fetchJSON('/fn/minersweeper/getState', {
        gameHash: hash
      }).then(actions => {
        store.dispatch({
          type: 'FETCH_ACTIONS',
          actions
        })
      })

      fetchActions()
      this.actionsInterval =  setInterval(
        fetchActions, FETCH_ACTIONS_INTERVAL
      )
    }
  }

  private stopPolling() {
    clearInterval(this.actionsInterval)
  }
}

const mapStateToProps = state => ({
  matrix: state.currentGame.matrix,
  myActions: state.myActions,  // NB: dumb hack to ensure updates
})

export default connect(mapStateToProps)(Field);
