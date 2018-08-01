import * as React from 'react';
import {connect} from 'react-redux';

import {Action, ActionType, GameBoard, MoveDefinition, XY} from '../../../minesweeper'

import './Cell.css';

import {Hash} from '../../../holochain';

import CellMatrix from '../CellMatrix';
import {fetchJSON} from '../common'
import store from '../store'

interface IminiMapProps {
  gameBoard: GameBoard;
};

class MiniMap extends React.Component<IminiMapProps> {

  private canvasRef: React.RefObject<HTMLCanvasElement>;

  constructor(props) {
    super(props)
    this.canvasRef = React.createRef();
  }

  public componentDidMount() {
      this.updateCanvas();
  }

  public render() {
    return (
        <canvas ref={this.canvasRef} width={this.props.gameBoard.size.x} height={this.props.gameBoard.size.y}/>
    );
  }

  private updateCanvas() {
      const canvas = this.canvasRef.current!
      const ctx = canvas.getContext('2d')!;
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const buf = new ArrayBuffer(imageData.data.length);
      const buf8 = new Uint8ClampedArray(buf);
      const data = new Uint32Array(buf);
      for (let y = 0; y < canvas.height; ++y) {
        for (let x = 0; x < canvas.width; ++x) {
          const value = 4;
            data[y * canvas.width + x] =
              (255   << 24) |    // alpha
              (value/2 << 16) |    // blue
              (value <<  8) |    // green
              255;            // red
        }
      }
    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
  }
}

export default MiniMap;
