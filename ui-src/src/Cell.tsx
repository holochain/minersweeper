import * as React from 'react';
import './Cell.css';


// enum CellStatus {
//   CellFresh,
//   CellRevealed,
//   CellMarked,
// }

// type CellProps = {
//   status: CellStatus
// }

const Cell = ({columnIndex, rowIndex, key, style}) => {
  return <div className="Cell" style={style}/>
}

export default Cell;
