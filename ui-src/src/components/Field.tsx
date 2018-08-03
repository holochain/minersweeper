import * as React from 'react';
import './Field.css';

import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { AutoSizer, Grid } from 'react-virtualized';

import {Hash} from '../../../holochain';
import {Pos} from '../../../minesweeper';

import Cell from './Cell';
import CellMatrix from '../CellMatrix';

import * as common from '../common';
import store from '../store';

type FieldProps = {
  gameHash: Hash,
  matrix: CellMatrix,
  myActions: number  // NB: dumb hack to ensure updates
}

type FieldState = {

}

const PAN_OFFSETS = {
  37: {x: -1, y: 0},  // left
  38: {x: 0, y: -1},  // up
  39: {x: 1, y: 0},   // right
  40: {x: 0, y: 1},   // down
}

class Field extends React.Component<FieldProps, FieldState> {

  private grid = React.createRef()

  // tracks key down/up state for each arrow key
  private panKeys: any = {}

  // for pan polling
  private panInterval: any = null

  // for action polling
  private actionsInterval: any = null

  // used to turn off action polling and other things
  private keyPanOffset: Pos = {x: 0, y: 0}
  private mousePanOffset: Pos = {x: 0, y: 0}


  public componentWillMount() {
    this.startPollingActions()
    this.startPollingPan()
    window.addEventListener('keydown', this.keyDownListener)
    window.addEventListener('keyup', this.keyUpListener)
    window.addEventListener('mousemove', this.mouseMoveListener)
  }

  public componentWillUnmount() {
    this.stopPollingActions()
    window.removeEventListener('keydown', this.keyDownListener)
    window.removeEventListener('keyup', this.keyUpListener)
    window.addEventListener('mousemove', this.mouseMoveListener)
  }

  public render() {
    const columns = this.props.matrix.size.x
    const rows = this.props.matrix.size.y
    const cellSize = common.CELL_SIZE
    const overscan = 0

    return (
      <div className="field-container">
        <AutoSizer>{
          ({width, height}) => <Grid
            ref={ this.grid }
            cellRenderer={this.CellWrapped}
            columnCount={columns + common.MARGIN_CELLS * 2}
            rowCount={rows + common.MARGIN_CELLS * 2}
            columnWidth={cellSize}
            rowHeight={cellSize}
            height={height}
            tabIndex={null}
            width={width}
            overscanColumnCount={overscan}
            overscanRowCount={overscan}
            overscanIndicesGetter={this.overscanIndicesGetter}
            scrollingResetTimeInterval={0}
            isScrollingOptOut={false}
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
      columnIndex={columnIndex - common.MARGIN_CELLS}
      rowIndex={rowIndex - common.MARGIN_CELLS}
      {...props}/>
  )

  private keyDownListener = e => {
    if (e.keyCode in PAN_OFFSETS) {
      this.panKeys[e.keyCode] = true
    }
  }

  private keyUpListener = e => {
    if (e.keyCode in PAN_OFFSETS) {
      delete this.panKeys[e.keyCode]
    }
  }

  private mouseMoveListener = e => {
    const grid: Grid = this.grid.current
    if (!grid) {
      return
    }
    const div = grid!._scrollingContainer
    const {offsetWidth, offsetHeight} = div
    const {clientX, clientY} = e
    const margin = common.MOUSE_PAN_MARGIN
    const speed = common.MOUSE_PAN_SPEED
    const offset = {
      x: 0,
      y: 0,
    }
    if (clientX < margin) {
      offset.x -= speed
    }
    if (offsetWidth - clientX < margin) {
      offset.x += speed
    }
    if (clientY < margin) {
      offset.y -= speed
    }
    if (offsetHeight - clientY < margin) {
      offset.y += speed
    }
    this.mousePanOffset = offset
  }

  private panOffset() {
    return {
      x: this.keyPanOffset.x + this.mousePanOffset.x,
      y: this.keyPanOffset.y + this.mousePanOffset.y,
    }
  }

  private isPanning() {
    const {x, y} = this.panOffset()
    return x !== 0 || y !== 0
  }

  private performPan() {
    const grid: any = this.grid.current!
    const container = grid._scrollingContainer
    const {scrollLeft, scrollTop} = container
    const pos = {scrollLeft, scrollTop}
    const {x, y} = this.panOffset()
    pos.scrollLeft += x
    pos.scrollTop += y
    grid.scrollToPosition(pos)
  }

  private startPollingPan() {
    if (this.panInterval) {
      return
    }
    const speed = common.CELL_SIZE
    this.panInterval = setInterval(
      () => {
        const pos = {x: 0, y: 0}
        Object.keys(this.panKeys).forEach(code => {
          if(this.panKeys[code]) {
            const offset = PAN_OFFSETS[code]
            pos.x += offset.x * speed
            pos.y += offset.y * speed
          }
        })
        this.keyPanOffset = pos
        this.performPan()
      }, 10  // TODO: make constant
    )
  }

  private stopPollingPan() {
    clearInterval(this.panInterval)
  }

  private startPollingActions() {
    const hash = this.props.gameHash
    if (hash) {
      const fetchActions = () => common.fetchJSON('/fn/minersweeper/getState', {
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
          if (!this.keyPanOffset) {
            fetchActions()
          }
        }, common.FETCH_ACTIONS_INTERVAL
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
    stopIndex,          // End of range of visible cells
  }) => {
    return {
      overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount)
    }
  }
}

const mapStateToProps = state => ({
  matrix: state.currentGame.matrix,
  myActions: state.myActions,  // NB: dumb hack to ensure updates
})

export default connect(mapStateToProps)(Field);
