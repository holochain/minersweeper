import * as React from 'react';
// import './CreateGameForm.css';

// import {GameParams, tempGameParams} from '../types';

class CreateGameForm extends React.Component {

  private inText: HTMLInputElement | null = null
  private inWidth: HTMLInputElement | null = null
  private inHeight: HTMLInputElement | null = null

  public render() {
    return <div className="CreateGameForm">
      <input type="text" ref={el => this.inText = el}/>
      <input type="number" ref={el => this.inWidth = el}/>
      <input type="number" ref={el => this.inHeight = el}/>
      <button onClick={this.handleCreate}>New Game</button>
    </div>
  }

  private handleCreate() {
    const {inText, inWidth, inHeight} = this
    if (inText && inWidth && inHeight) {
      const text = inText!.value
      const width = inWidth!.value
      const height = inHeight!.value

    }
  }
}

export default CreateGameForm;
