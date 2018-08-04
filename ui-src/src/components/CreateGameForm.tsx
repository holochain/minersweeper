import * as React from 'react';
import { connect } from 'react-redux';

import './CreateGameForm.css';

import * as actions from '../actions';
import { fetchJSON } from '../common';
import store from '../store';


enum Difficulty {
  Easy = 0.2,
  Intermediate = 0.3,
  Expert = 0.4,
}

enum BoardSize {
  Small = 20,
  Medium = 50,
  Large = 100,
  Mega = 500,
}

type CreateGameFormState = {
  errorMessage: string | null
  selectedDifficulty: number
  selectedGameSize: number
}

class CreateGameForm extends React.Component<any, CreateGameFormState> {

  private inDescription: HTMLInputElement | null = null

  constructor(props) {
    super(props)
    this.state = {errorMessage: null, selectedDifficulty: Difficulty.Easy, selectedGameSize: BoardSize.Medium}
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
      <select id="sizeSelect" value={this.state.selectedGameSize} onChange={this.handleChange} className="register-input">
        {
          Object.keys(BoardSize).filter(k => !Number(k)).map(k => {
            return <option key={k} value={BoardSize[k]}>{k + ": (" + BoardSize[k] + "x" + BoardSize[k] + " tiles)"}</option>;
          })
        }
      </select>
      <br/>
      <select id="difficultySelect" value={this.state.selectedDifficulty} onChange={this.handleChange} className="register-input">
        <option value={Difficulty.Easy}>I'm Too Young To Die - {Difficulty.Easy*100}% mines</option>
        <option value={Difficulty.Intermediate}>Hurt me plenty - {Difficulty.Intermediate*100}% mines</option>
        <option value={Difficulty.Expert}>Ultra-Violence - {Difficulty.Expert*100}% mines</option>
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
    const { inDescription} = this;
    if (inDescription) {
      const description = inDescription!.value
      const x = this.state.selectedGameSize
      const y = x
      const nCells = x*y;

      const nMines = Math.round(nCells*(this.state.selectedDifficulty));

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

  private handleChange = (event) => {
    switch(event.target.id) {
      case "difficultySelect":
        this.setState({selectedDifficulty: parseFloat(event.target.value)});
        break;
      case "sizeSelect":
        this.setState({selectedGameSize: parseInt(event.target.value, 10)});
        break;
    }
    console.log("state: ", this.state);
  }
}


export default connect()(CreateGameForm);
