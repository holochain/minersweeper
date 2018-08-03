import * as React from 'react';
import { connect } from 'react-redux';

import './CreateGameForm.css';

import * as actions from '../actions';
import { fetchJSON } from '../common';
import store from '../store';

const EASY_DENSITY: number = 0.1;
const INTERMEDIATE_DENSITY: number = 0.2;
const EXPERT_DENSITY: number = 0.3;

type CreateGameFormState = {
  errorMessage: string | null
  selectedDifficulty: string
  boardWidth: number
  boardHeight: number
}

class CreateGameForm extends React.Component<any, CreateGameFormState> {

  private inWidth: HTMLInputElement | null = null
  private inHeight: HTMLInputElement | null = null
  private inDescription: HTMLInputElement | null = null

  constructor(props) {
    super(props)
    this.state = {errorMessage: null, selectedDifficulty: 'easy', boardWidth: 100, boardHeight: 100}
    this.handleChange = this.handleChange.bind(this);
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
      <input id="widthInput" className="register-input" value={this.state.boardWidth} onBlur={this.handleChange} type="number" ref={el => this.inWidth = el} placeholder="Gameboard Width"/>
      <input id="heightInput" className="register-input" value={this.state.boardHeight} onBlur={this.handleChange} type="number" ref={el => this.inHeight = el} placeholder="Gameboard Height"/>
      <br/>
      <select id="difficultySelect" value={this.state.selectedDifficulty} onChange={this.handleChange} className="register-input">
        <option value='easy'>I'm Too Young To Die - {EASY_DENSITY*100}% mines</option>
        <option value='intermediate'>Hurt me plenty - {INTERMEDIATE_DENSITY*100}% mines</option>
        <option value='expert'>Ultra-Violence - {EXPERT_DENSITY*100}% mines</option>
      </select>
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
    const { inDescription, inWidth, inHeight } = this;
    if (inDescription && inWidth && inHeight) {
      const description = inDescription!.value
      const x = parseInt(inWidth!.value, 10)
      const y = parseInt(inHeight!.value, 10)
      const nCells = x*y;
      let mineFraction: number = 0;

      switch(this.state.selectedDifficulty) {
        case 'easy':
          mineFraction = EASY_DENSITY;
          break;
        case 'intermediate':
          mineFraction = INTERMEDIATE_DENSITY;
          break;
        case 'expert':
          mineFraction = EXPERT_DENSITY;
          break;          
      }

      const nMines = Math.round(nCells*mineFraction);

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

  private clipToRange(x: number): number {
    return Math.max(Math.min(x,1000),10);
  }

  private handleChange(event) {
    switch(event.target.id) {
      case "difficultySelect":
        this.setState({selectedDifficulty: event.target.value});
        break;
      case "widthInput":
        this.setState({boardWidth: this.clipToRange(event.target.value)})
        break;
      case "heightInput":
        this.setState({boardHeight: this.clipToRange(event.target.value)})
        break;
    }
  }
}


export default connect()(CreateGameForm);
