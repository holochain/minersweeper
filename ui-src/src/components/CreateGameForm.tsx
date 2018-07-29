import * as React from 'react';
// import './CreateGameForm.css';

import * as actions from '../actions';
import store from '../store';
import {GameParams} from '../types';

class CreateGameForm extends React.Component {

  private inWidth: HTMLInputElement | null = null
  private inHeight: HTMLInputElement | null = null
  private inDescription: HTMLInputElement | null = null

  public render() {
    return <div className="CreateGameForm">
      <input type="number" ref={el => this.inWidth = el}/>
      <input type="number" ref={el => this.inHeight = el}/>
      <br/>
      <input type="text" ref={el => this.inDescription = el}/>
      <br/>
      <button onClick={this.handleCreate}>New Game</button>
    </div>
  }

  private handleCreate = () => {
    const {inDescription, inWidth, inHeight} = this
    if (inDescription && inWidth && inHeight) {
      const description = inDescription!.value
      const width = parseInt(inWidth!.value, 10)
      const height = parseInt(inHeight!.value, 10)
      store.dispatch(actions.newGame({width, height, description}))
    }
  }
}

export default CreateGameForm;
