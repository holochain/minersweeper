import * as React from 'react';
import './App.css';

import { AutoSizer, Grid } from 'react-virtualized';

import Cell from './Cell';

type GameParams = {
  width: number,
  height: number,
}


type XY = [number, number]

// class ActionReveal {public xy: XY}
// class ActionMark {public xy: XY}
// class ActionChat {public message: string}

type Action = XY

type FieldProps = {
  gameParams: GameParams,
  actions: Action[]
}

const Field = ({gameParams, actions}: FieldProps) => {
  return (
    <AutoSizer>{
      ({width, height}) => <Grid
        cellRenderer={Cell}
        columnCount={gameParams.width}
        columnWidth={20}
        height={height}
        rowCount={gameParams.height}
        rowHeight={20}
        width={width}
      />
    }</AutoSizer>
  )
  // const rows = []
  // for (let r = 0; r < gameParams.height; r++) {
  //   const cells = []
  //   for (let c = 0; r < gameParams.height; r++) {
  //     cells.push(<Cell key={c} status={CellFresh}/>)
  //   }
  //   rows.push(<div className="row" key={r}>{cells}</div>)
  // }
  // return rows
}

class App extends React.Component {
  public render() {

    const gameParams: GameParams = {
      height: 1000,
      width: 1000,
    }

    return (
      <div className="App">
        <Field gameParams={gameParams} actions={[]} />
      </div>
    );
  }
}

export default App;
