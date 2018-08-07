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
    constructor(props){
      super(props);
      this.state = {
        id: 0,
        messages: [
          {id: 0, authorName: 'Bot', text: 'Hello there. Type your messages here!'}
        ]
      };
    }

    public render() {
      console.log("IDENTITIES: ", this.props.identities)
      return(
        <div className='chat-box'>
          <MessagesList messages={this.props.chats} />
          <InputForm />
        </div>
      )
    }
  }

  ///////////////////////////////////////////////////////////////

class MessagesList extends React.Component<any, any> {
  public render() {
      return(
        <div>
          {this.props.currentGame.chats.map(msg => {
            // sort the messages my timestamp...
            return (
              <div key={msg.id}>
                {/* The key should ulitamtely be the hash of the chat msg. */}
                <Message id={msg.id} authorName={msg.authorName} text={msg.chat} />
                <hr className="chatbox-line-divide"/>
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
      return(
        <div ref={this.messageField} className='single-message-field'>
          <div className="message-authorname-container">
            <Jdenticon className="jdenticon" size={75} hash={ this.props.id } />
            <span><h4 className="message-author-name">{ this.props.authorName }</h4></span>
          </div>
          <div className="message-text">{ this.props.text }</div>
        </div>
      )
    }
  }

///////////////////////////////////////////////////////////////

  class InputForm extends React.Component<any, any> {
    private authorName: React.RefObject<any> = React.createRef()
    private text: React.RefObject<any> = React.createRef()

    constructor(props){
      super(props);
      this.onClickBtnClear = this.onClickBtnClear.bind(this);
      this.onClickBtnSend = this.onClickBtnSend.bind(this);
    }

    public onClickBtnSend = () => {
      let text = this.text.current.value;
      if (text.length) {
        // send chats to redux here:
        fetchJSON('/fn/minersweeper/getState').then(([agentHash, identity, chats]) =>
          store.dispatch({
            type: 'VIEW_GAME',
            chats,
          })
        )
         // this.props.handleMessage(text);
      }
      // Clear out the chatbox:
      text = '';
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
