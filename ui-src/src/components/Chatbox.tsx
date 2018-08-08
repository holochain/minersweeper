import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

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

export const ChatboxComponents = () => {
  const currentGame = store.getState().currentGame!
  if (currentGame === null) {
    return <div/>
  } else {
    const {gameHash, chats} = currentGame
    return(
      [
        <MessagesList key="messages" chats={chats} mode="blocks" />,
        <InputForm key="inputs" gameHash={gameHash} />
      ]
    )
  }
}


  ///////////////////////////////////////////////////////////////

class MessagesList extends React.Component<any, any> {
  public render() {
    if (this.props.mode === "single") {
      const list = this.props.chats
        .sortBy(a => a.timestamp)
        .map(({author, message}, i) =>
          <SingleMessage key={i} author={author} message={message} />
        )
      return <div className="messages-pane">{ list }</div>
    } else {
      const blocks = this.getChatBlocks()
      return(
        <div className="chat-box messages-pane">
          {blocks.map(({author, messages}, i) => {
            // assuming the messages are sorted by timestamp...
            const key = `chat-${i}`
            return <AuthorBlock key={key} author={author} messages={messages} />
          })}
        </div>
      )
    }
  }

  private getChatBlocks(): Array<{author: Hash, messages: Array<string>}> {
    const {chats} = this.props
    const blocks: Array<{author: Hash, messages: Array<string>}> = []
    let prevAuthor: Hash | null = null
    chats.sortBy(a => a.timestamp).forEach(({author, message}) => {
      if(author === prevAuthor) {
        const block = blocks[blocks.length - 1]
        block.messages.push(message)
      } else {
        blocks.push({
          author,
          messages: [message]
        })
      }
      prevAuthor = author
    })
    return blocks
  }
}

///////////////////////////////////////////////////////////////

const SingleMessage = ({author, message}) => {
  const authorName = store.getState().identities.get(author)
  return(
    <div className='single-message'>
      <Jdenticon className="jdenticon" size={24} hash={ author } />
      <div className="author">{ authorName }</div>
      <div className="separator">:</div>
      <div className="message">{ message }</div>
    </div>
    )
}

//////////////////////////////////////////////////////////////////

const AuthorBlock = ({author, messages}) => {
  const authorName = store.getState().identities.get(author)
  return(
    <div className='author-block'>
      <Jdenticon className="jdenticon" size={32} hash={ author } />
      <div className="content">
        <h4 className="author-name">{ authorName }</h4>
        <div className="message-block">
          { messages.map((text, i) =>
              <AuthorBlockMessage key={i}>
                { text }
              </AuthorBlockMessage>
            )
          }
        </div>
      </div>
    </div>
  )
}

class AuthorBlockMessage extends React.Component<any, any> {
  private div: React.RefObject<any> = React.createRef()
  public componentDidMount() {
    if(this.div.current) {
       this.div.current!.scrollIntoView();
    }
  }

  public render() {
    return <div ref={this.div} className="message-text">{ this.props.children }</div>
  }

}

///////////////////////////////////////////////////////////////

class InputForm extends React.Component<any, any> {
  private text: React.RefObject<HTMLTextAreaElement> = React.createRef()

  constructor(props) {
    super(props);
    // this.onClickBtnClear = this.onClickBtnClear.bind(this);
    // this.onClickBtnSend = this.onClickBtnSend.bind(this);
    // this.handleEnter = this.handleEnter.bind(this);
  }

  public onClickBtnSend = () => {
    let text = "";
    if (this.text.current!) {
      text = this.text.current!.value;
      console.log("text value inside onClickBtnSend : ", text);
    }

    if (text.length) {
      // send chats to redux here:
      const payload = {
        gameHash: this.props.gameHash,
        action: {
          actionType: "chat",
          text,
        }
      }
      fetchJSON("/fn/minersweeper/makeMove", payload);
      // can also immediately update chat here:
      ///////////////////
    }
    // Clear out the chatbox:
    this.text.current!.value = '';
  };
  public onClickBtnClear = () => {
    this.text.current!.value = '';
  };

  public handleEnter = (event) => {
    const text = this.text.current!.value;
    console.log("text value inside handleEnter : ", text);
    if (event.keyCode === 13 && text) {
       this.onClickBtnSend();
    }
  }

  public render() {
    return(
      <div className='input-area' onKeyUp={this.handleEnter} >
        <textarea className='input-text' placeholder="Type to chat..." defaultValue="" ref={ this.text } />
        <div className="inputButtons">
          <button className="inputButtonSend" onClick={this.onClickBtnSend}>Send</button>
          <button className="inputButtonClear" onClick={this.onClickBtnClear}>Clear</button>
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
