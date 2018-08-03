import * as React from 'react';
import './Field.css';

import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom'
import { AutoSizer, Grid } from 'react-virtualized';

import {Hash} from '../../../holochain';
import {Pos} from '../../../minersweeper';

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
  panOffset: Pos
}

const LEFT = {x: -1, y: 0}
const UP = {x: 0, y: -1}
const RIGHT = {x: 1, y: 0}
const DOWN = {x: 0, y: 1}

const PAN_OFFSETS = {
  37: LEFT,  // left
  65: LEFT,  // a

  38: UP,  // up
  87: UP,  // w

  39: RIGHT,   // right
  68: RIGHT,   // right

  40: DOWN,   // down
  83: DOWN,   // down
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

  // used to redraw all cells without scrolling
  private upperLeft = {columnIndex: 0, rowIndex: 0}

  constructor(props) {
    super(props)
    this.state = {
      panOffset: {x: 0, y: 0}
    }
  }

  public componentWillMount() {
    this.startPollingActions()
    this.startPollingPan()
    window.addEventListener('keydown', this.keyDownListener)
    window.addEventListener('keyup', this.keyUpListener)
    window.addEventListener('mousemove', this.mouseMoveListener)
    window.addEventListener('mouseleave', this.mouseLeaveListener)
  }

  public componentWillUnmount() {
    this.stopPollingActions()
    window.removeEventListener('keydown', this.keyDownListener)
    window.removeEventListener('keyup', this.keyUpListener)
    window.removeEventListener('mousemove', this.mouseMoveListener)
    window.removeEventListener('mouseleave', this.mouseLeaveListener)
  }

  public render() {
    const columns = this.props.matrix.size.x
    const rows = this.props.matrix.size.y
    const cellSize = common.CELL_SIZE
    const overscan = 0

    const mousePanIndicators = [UP, DOWN, LEFT, RIGHT].map(({x, y}, i) => {
      const width = y === 0 ? common.MOUSE_PAN_MARGIN : '100%'
      const height = x === 0 ? common.MOUSE_PAN_MARGIN : '100%'
      const horizontal = x === -1 ? 'left' : 'right'
      const vertical = y === -1 ? 'top' : 'bottom'
      const o = this.mousePanOffset
      const opacity = (x * o.x + y * o.y > 0) ? 1 : 0
      const style = {
        width, height, opacity,
        [horizontal]: 0,
        [vertical]: 0,
      }
      return <div className="mouse-pan-indicator" style={style} key={i}/>
    })

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
            scrollingResetTimeInterval={150}
            isScrollingOptOut={false}
          />
        }</AutoSizer>
        { mousePanIndicators }
      </div>
    )
  }

  private CellWrapped = ({key, columnIndex, rowIndex, ...props}) => (
    <Cell
      {...props}
      myActions={this.props.myActions}
      gameHash={this.props.gameHash}
      key={key}
      columnIndex={columnIndex - common.MARGIN_CELLS}
      rowIndex={rowIndex - common.MARGIN_CELLS}
      />
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
    if (offsetWidth - clientX < margin && clientX <= offsetWidth) {
      offset.x += speed
    }
    if (clientY < margin) {
      offset.y -= speed
    }
    if (offsetHeight - clientY < margin && clientY <= offsetHeight) {
      offset.y += speed
    }
    this.mousePanOffset = offset
  }

  private mouseLeaveListener() {
    console.log('TODO: make this actually work')
    this.mousePanOffset = {
      x: 0,
      y: 0
    }
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
    if (x !== this.state.panOffset.x || y !== this.state.panOffset.y) {
      this.setState({panOffset: {x, y}})
    }
    pos.scrollLeft += x
    pos.scrollTop += y
    grid.scrollToPosition(pos)
  }

  private startPollingPan() {
    if (this.panInterval) {
      return
    }
    const speed = common.KEY_PAN_SPEED
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
      }, common.PAN_INTERVAL
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
          if (!this.isPanning()) {
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
