import * as React from 'react';
import './Minimap.css';

import { connect } from 'react-redux';

import * as common from '../common';
import store from '../store';
import {StoreState} from '../types';


const MAX_MINIMAP_SIZE = 200

type MinimapProps = {}
type MinimapState = {}

type MinimapViewport = {
  x: number,
  y: number,
  w: number,
  h: number,
}

class Minimap extends React.Component<MinimapProps, MinimapState> {

  private viewport: MinimapViewport = {
    x: 0, y: 0, w: 0, h: 0
  }
  private canvas = React.createRef<HTMLCanvasElement>()
  private drawInterval: any = null

  public setViewport(viewport: MinimapViewport) {
    this.viewport = viewport
    this.forceUpdate()
  }

  public componentWillMount() {
    const {gameBoard} = store.getState().currentGame!
    const {x, y} = gameBoard.size
  }

  public componentDidMount () {
    this.draw()
    this.drawInterval = setInterval(this.draw, common.MINIMAP_DRAW_INTERVAL)
  }

  public componentWillUnmount() {
    clearInterval(this.drawInterval)
  }

  public render() {
    const {gameBoard} = store.getState().currentGame!
    const [[width, height], scale] = this.sizeAndScale()
    const {x, y, w, h} = this.viewport
    const style = {
      left: (x * 100) + '%',
      top: (y * 100) + '%',
      width: (w * 100) + '%',
      height: (h * 100) + '%',
    }
    return <div className="minimap">
      <canvas ref={this.canvas} width={width} height={height} />
      <div className="viewport" style={style}/>
    </div>
  }

  private ctx() {
    return this.canvas.current!.getContext('2d')!
  }

  private draw = () => {
    const canvas = this.canvas.current!
    const ctx = this.ctx()
    const {matrix, gameBoard} = store.getState().currentGame!
    const [[width, height], scale] = this.sizeAndScale()
    ctx.clearRect(0, 0, width, height)
    const imageData = ctx.getImageData(0, 0, width, height)
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const pixel = matrix.minimapColor({x, y}, scale)
        if (pixel) {
          for (let b = 0; b < 4; b++) {
            for (let i = 0; i < scale; i++) {
              for (let j = 0; j < scale; j++) {
                imageData.data[(y + j) * (width * 4) + ((x + i) * 4) + b] = pixel[b]
              }
            }
          }
        }
      }
    }
    ctx.putImageData(imageData, 0, 0)
  }

  private sizeAndScale(): [[number, number], number] {
    const {gameBoard} = store.getState().currentGame!
    const {x, y} = gameBoard.size
    let dim = Math.max(x, y)
    let scale = 1
    // scale down dim by the closest power of two
    while (dim > MAX_MINIMAP_SIZE) {
      dim >>= 1
      scale <<= 1
    }
    return [[x / scale, y / scale], scale]
  }
}



export default Minimap;
