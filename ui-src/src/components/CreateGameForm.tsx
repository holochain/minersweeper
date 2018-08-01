import * as React from 'react';
import { connect } from 'react-redux';

import './CreateGameForm.css';

import * as actions from '../actions';
import { fetchJSON } from '../common';
import store from '../store';

type CreateGameFormState = {
  errorMessage: string | null
}

class CreateGameForm extends React.Component<any, CreateGameFormState> {

  private inWidth: HTMLInputElement | null = null
  private inHeight: HTMLInputElement | null = null
  private inMines: HTMLInputElement | null = null
  private inDescription: HTMLInputElement | null = null

  constructor(props) {
    super(props)
    this.state = {errorMessage: null}
  }

  public render() {
    let errorDisplay: JSX.Element | null = null
    if (this.state.errorMessage) {
      errorDisplay = <div className="error-message">{ this.state.errorMessage }</div>
    }
    return <div className="create-game-form">
      <h1 className="registration-header">Game Registration</h1>
      <h4>Register the Details of Your Game Below</h4>
      <hr className="reg-hr"/>
      <input className="register-input" type="number" ref={el => this.inWidth = el} placeholder="Gameboard Width"/>
      <input className="register-input" type="number" ref={el => this.inHeight = el} placeholder="Gameboard Height"/>
      <br/>
      <input className="register-input" type="number" ref={el => this.inMines = el} placeholder="# of Mines"/>
      <br/>
      <input className="register-input" type="text" ref={el => this.inDescription = el} placeholder="Title"/>
      <br/>
      <hr className="reg-hr"/>
      { errorDisplay }
      <hr className="reg-hr"/>
      <button className="modal-button" onClick={this.props.onCreate}>Close</button>
      <button className="modal-button" onClick={this.handleCreate}>New Game</button>
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
        .then(response => {
          if (response.errorMessage) {
            // TODO: better message
            this.setState({errorMessage: "Game size must be at least 11x11, and you can't have too many mines"})
          } else {
            this.setState({errorMessage: null})
            this.props.dispatch({ type: 'CONFIRM_NEW_GAME', response })
            this.props.onCreate()
          }
        })
    }
  }
}


export default connect()(CreateGameForm);
