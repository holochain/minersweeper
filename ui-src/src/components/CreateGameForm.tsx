import * as React from 'react';
import { connect } from 'react-redux';

import './CreateGameForm.css';

import * as actions from '../actions';
import { fetchJSON } from '../common';
import store from '../store';


class CreateGameForm extends React.Component<any, {}> {

  private inWidth: HTMLInputElement | null = null
  private inHeight: HTMLInputElement | null = null
  private inMines: HTMLInputElement | null = null
  private inDescription: HTMLInputElement | null = null

  public render() {
    return <div className="create-game-form">
      <h2 className="registration-header">Game Registration</h2>
      <h6>Register the Details of Your Game Below</h6>
      <hr className="reg-hr"/>
      <input className="register-input" type="number" ref={el => this.inWidth = el} placeholder="width"/>
      <input className="register-input" type="number" ref={el => this.inHeight = el} placeholder="height"/>
      <br/>
      <input className="register-input" type="number" ref={el => this.inMines = el} placeholder="# of mines"/>
      <br/>
      <input className="register-input" type="text" ref={el => this.inDescription = el} placeholder="description"/>
      <br/>
      <hr className="reg-hr"/>
      <button className="register-button" onClick={this.handleCreate}>New Game</button>
    </div>

  }


  public handleCreate = () => {
    const { inDescription, inWidth, inHeight, inMines } = this;
    if (inDescription && inWidth && inMines && inHeight) {
      const description = inDescription!.value
      const x = parseInt(inWidth!.value, 10)
      const y = parseInt(inHeight!.value, 10)
      const nMines = parseInt(inMines!.value, 10)
      // this.props.newGame({width, height, description})
      fetchJSON('/fn/minersweeper/newGame', {description, nMines, size: {x,y}})
        .then(hash =>
          this.props.dispatch({ type: 'CONFIRM_NEW_GAME', hash })
        )
    }
  }
}


export default connect()(CreateGameForm);
