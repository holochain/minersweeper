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
  fetchJSON,
  xor
} from '../common';
import store from '../store';

type FieldProps = {
  gameHash: Hash,
  matrix: CellMatrix,
  myActions: number  // NB: dumb hack to ensure updates
}

type FieldState = {
  isPanning: boolean
}

const PAN_OFFSETS = {
  37: {x: -1, y: 0},
  38: {x: 0, y: -1},
  39: {x: 1, y: 0},
  40: {x: 0, y: 1},
}

class Field extends React.Component<FieldProps, FieldState> {

  private grid = React.createRef()
  private panKeys: any = {}
  private panInterval: any = null
  private actionsInterval: any = null
  private isPanning = false

  constructor(props) {
    super(props)
  }

  public componentWillMount() {
    this.startPollingActions()
    this.startPollingPan()

    window.addEventListener('keydown', e => {
      if (e.keyCode in PAN_OFFSETS) {
        this.panKeys[e.keyCode] = true
      }
    })

    window.addEventListener('keyup', e => {
      if (e.keyCode in PAN_OFFSETS) {
        delete this.panKeys[e.keyCode]
      }
    })
  }

  public componentWillUnmount() {
    this.stopPollingActions()
  }

  public render() {
    const columns = this.props.matrix.size.x
    const rows = this.props.matrix.size.y
    const cellSize = CELL_SIZE
    const overscan = this.isPanning ? 0 : 30
    console.log(overscan)

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
            overscanColumnCount={overscan}
            overscanRowCount={overscan}
            overscanIndicesGetter={this.overscanIndicesGetter}
            scrollingResetTimeInterval={0}
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

  private startPollingPan() {
    if (this.panInterval) {
      return
    }
    const speed = CELL_SIZE
    this.panInterval = setInterval(
      () => {
        const grid : any = this.grid.current!
        const container = grid._scrollingContainer
        const {scrollLeft, scrollTop} = container
        const pos = {scrollLeft, scrollTop}
        let isPanning = false
        Object.keys(this.panKeys).forEach(code => {
          isPanning = true
          if(this.panKeys[code]) {
            const offset = PAN_OFFSETS[code]
            pos.scrollLeft += offset.x * speed
            pos.scrollTop += offset.y * speed
          }
        })
        if (xor(this.isPanning, isPanning)) {
          // to reset overscan immediately
          this.isPanning = isPanning
          this.forceUpdate()
          if (isPanning) {
            return
          }
        }
        if (isPanning) {
          grid.scrollToPosition(pos)
        }
      }, 10
    )
  }

  private stopPollingPan() {
    clearInterval(this.panInterval)
  }

  private startPollingActions() {
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
      this.actionsInterval = setInterval(
        () => {
          if (!this.isPanning) {
            fetchActions()
          }
        }, FETCH_ACTIONS_INTERVAL
      )
    }
  }

  private stopPollingActions() {
    clearInterval(this.actionsInterval)
  }


  // from https://github.com/bvaughn/react-virtualized/blob/master/docs/Grid.md#overscanindicesgetter
  private overscanIndicesGetter = ({
    direction,          // One of "horizontal" or "vertical"
    cellCount,          // Number of rows or columns in the current axis
    scrollDirection,    // 1 (forwards) or -1 (backwards)
    overscanCellsCount, // Maximum number of cells to over-render in either direction
    startIndex,         // Begin of range of visible cells
    stopIndex           // End of range of visible cells
  }) => {
    // if (this.isPanning) {
    //   overscanCellsCount = 0
    // }
    return {
      overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
    }
  }

  // private isPanning() {
  //   return Object.keys(this.panKeys).some(k => this.panKeys[k])
  // }
}

const mapStateToProps = state => ({
  matrix: state.currentGame.matrix,
  myActions: state.myActions,  // NB: dumb hack to ensure updates
})

export default connect(mapStateToProps)(Field);
