import * as React from 'react';
import { connect } from 'react-redux';

import { Action, ActionType } from '../../../minersweeper';

import './Chatbox.css';

import {Hash} from '../../../holochain';

import Jdenticon from './Jdenticon';

import { fetchJSON } from '../common';
import store from '../store';

type ChatProps = {
  gameHash: Hash,
  agentHash: Hash,
  chat: any,
  allPlayerHandles: Map<Hash, string>
  authorName: string,
}

/////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

class Chatbox extends React.Component<any, any> {

  public render() {
    const {currentGame} = this.props
    if (currentGame === null) {
      return <div/>
    } else {
      const {gameHash, chats} = currentGame
      return(
        <div className='chat-box'>
          <MessagesList chats={chats} />
          <InputForm gameHash={gameHash} />
        </div>
      )
    }
  }
}

  ///////////////////////////////////////////////////////////////

class MessagesList extends React.Component<any, any> {
  public render() {
    return(
      <div>
        {this.props.chats.map(({author, message}, i) => {
          // assuming the messages are sorted by timestamp...
          const key = `chat-${i}`
          return (
            <div key={key}>
              {/* The i should ulitamtely be the hash of the chat chat. */}
              <Message id={key} author={author} text={message} />
            </div>
          )
        })}
      </div>
    )
  }
}

  ///////////////////////////////////////////////////////////////

class Message extends React.Component<any, any> {
  private messageField: React.RefObject<any>  = React.createRef()

  constructor(props){
    super(props);
  }

  public componentDidMount() {
    if(this.messageField.current){
       this.messageField.current!.scrollIntoView();
    }
  }

  public render() {
    const {author, text} = this.props
    const authorName = store.getState().identities.get(author)
    return(
      <div ref={this.messageField} className='single-message-field-b'>
        <div className="message-authorname-container">
          <Jdenticon className="jdenticon" size={33} hash={ author } />
          <span><h4 className="message-author-name">{ authorName }</h4></span>
        </div>
        <div className="message-text">{ text }</div>
      </div>
    )
  }
}

///////////////////////////////////////////////////////////////

class InputForm extends React.Component<any, any> {
  private authorName: React.RefObject<any> = React.createRef()
  private text: React.RefObject<any> = React.createRef()

  constructor(props) {
    super(props);
    this.onClickBtnClear = this.onClickBtnClear.bind(this);
    this.onClickBtnSend = this.onClickBtnSend.bind(this);
  }

  public onClickBtnSend = () => {
    const text = this.text.current.value;
    if (text.length) {
      // send chats to redux here:
      const payload = {
        gameHash: this.props.gameHash,
        action: {
          actionType: "chat",
          text,
        }
      }
      fetchJSON('/fn/minersweeper/makeMove', payload);
      // also immediately update chat here
    }
    // Clear out the chatbox:
    this.text.current.value = '';
  };
  public onClickBtnClear = () => {
    this.text.current.value = '';
  };

  public render() {
    return(
      <div className='inputField'>
        <textarea className='input-text' placeholder='Message' defaultValue='' ref={this.text}/>
        <div className='inputButtons'>
          <button className='inputButtonSend' onClick={this.onClickBtnSend}>Send</button>
          <button className='inputButtonClear' onClick={this.onClickBtnClear}>Clear</button>
        </div>
      </div>
    )
  }
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

const mapStateToProps = ({ identities, currentGame, whoami }) => ({
  identities, currentGame, whoami,
})

export default connect(mapStateToProps)(Chatbox)

// console.log("currentGame.......", this.props.currentGame)
// // Chats are available as: this.props.currentGame.chats
// console.log("identities.......", this.props.identities)
// // Agent Hashs are available as: this.props.identities
// console.log("whoami.......", this.props.whoami)
// // Whoami (current user's Hash) available as: this.props.whoami.agentHash
// // Whoami (current user's Username) available as: this.props.whoami.identity

///////////////////////////////////////////////////////////////////////////////

// public componentWillMount() {
//   const authorHash = this.props.identities.hash;
//   const text = this.props.currentGame.chats;
//   const nameCheck = this.props.identities.ownerID;
//   let authorName = ""
//
//   if (nameCheck.length > 15 ) {
//     authorName = nameCheck.substring(0,15);
//     console.log("authorName", authorName);
//   } else {
//     authorName = nameCheck;
//     console.log("authorName", authorName);
//   }
//
//   this.setState({
//     messages: { id: authorHash, authorName, text: this.props.currentGame.chats }
//   });
// };
