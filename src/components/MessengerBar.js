import React, { useState, useEffect, useRef, useImperativeHandle } from 'react'
import socketServices from '../services/socketManager'



const MeMessage = ({ sender, content }) => {

  return (
    <div className="meMsgPacket my-4" >
      <div className="meMsgInitial msgInitial">{sender}</div>
      <div className="msg meMsg">{content}</div>
  </div>
  )
}
const ThemMessage = ({ sender, content }) => {

  return (
    <div className="otherMsgPacket my-4" >
      <div className="msgInitial">{sender}</div>
      <div className="msg otherMsg">{content}</div>
  </div>
  )
}


function MessengerBar({id, username, session}) {
  const [navBarVis, setNavBarVis] = useState(true)
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)

  const textAreaSubmit = (e) => {
    if(e.key === 'Enter') {
      e.preventDefault()
      document.getElementById('textMsgForm').requestSubmit()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(messageText) {
      const newMessage = {
        id: Math.random(),
        userId: id,
        username: username,
        content: messageText,
      }
      setMessages(messages.concat(newMessage))
      socketServices.sendMessage(newMessage)
      setMessageText('')
    }
  }


  useEffect(() => {
    if(!session) {
      return
    } else {
      socketServices.receiveMessage((message) => {
        setMessages(messages => messages.concat(message))
      })
    }
  }, [session])

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  })

  return (
    <div id="messengerSideBar" aria-label='sidebar' aria-hidden={navBarVis} className="sidebar row msgRow">
      <div className="buttonArmBox msgArmBox">
        <div onClick={() => setNavBarVis(!navBarVis)} className="noselect toggleClickBox msgClickBox">Chat</div>
      </div>
      <div className="messageBox">
          {messages.map(message => {
            if(id === message.userId) {
              return <MeMessage 
                key={message.id} 
                sender={username} 
                content={message.content} 
                />
            } else {
              return <ThemMessage 
                key={message.id} 
                sender={message.username} 
                content={message.content} 
                />
            }
          })}
          <div ref={bottomRef}></div>
      </div>
      <div className="sendMessageBox">
        <form className="messageTextBox" onSubmit={handleSubmit} id="textMsgForm">
          <textarea
            className="textAreaBox"
            value={messageText}
            onChange={({ target })=> setMessageText(target.value)}
            onKeyDown={textAreaSubmit}
          />
        </form>
      </div>
    </div>
  )
}

export default MessengerBar