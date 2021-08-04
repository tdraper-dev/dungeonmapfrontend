import React, { useState, useEffect, useRef } from 'react'
import socketServices from '../services/socketManager'
import { BsChat } from 'react-icons/bs'


const SystemMessage = ({ content }) => {

  return (
    <div className="systemMessage px-2 mb-2" >
      <div className="">{content}</div>
    </div>
  )
}

const MeMessage = ({ sender, content }) => {

  return (
    <div className="meMsgPacket mb-4" >
      <div className="meMsgInitial msgInitial">{sender}</div>
      <div className="msg meMsg">{content}</div>
    </div>
  )
}
const ThemMessage = ({ sender, content }) => {

  return (
    <div className="otherMsgPacket mb-4" >
      <div className="otherMsgInitial msgInitial">{sender}</div>
      <div className="msg otherMsg">{content}</div>
  </div>
  )
}


function MessengerBar({id, username, session, float, setFloat}) {
  const [navBarVis, setNavBarVis] = useState(true)
  const [messageText, setMessageText] = useState('')
  const [messages, setMessages] = useState([])
  const blueCircleRef = useRef(null)
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
        systemMsg: false
      }
      setMessages(messages.concat(newMessage))
      socketServices.sendMessage(newMessage)
      setMessageText('')
    }
  }

  const toggleMovement = () => {
    setNavBarVis(!navBarVis)
    setFloat(!float)
  }


  useEffect(() => {
    if(!session) {
      return
    } else {
      socketServices.receiveMessage((message) => {
        setMessages(messages => messages.concat(message))
        
        blueCircleRef.current.id = 'blueCircleBounce'
        setTimeout(() => {
          blueCircleRef.current.id = ''
        }, 1000)
      })
    }
  }, [session])

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  })

  return (
    <div id="messengerSideBar" aria-label='sidebar' aria-hidden={navBarVis} className="sidebar row msgRow">
      <div className="buttonArmBox msgArmBox">
        <div ref={blueCircleRef} onClick={toggleMovement} className="noselect toggleClickBox msgClickBox">Chat</div>
      </div>
      <div className="messageBox">
          {messages.map(message => {
            if(message.systemMsg) {
              return <SystemMessage
                key={message.id}
                content={message.content}
                />
            }
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
            id="chatMessageBox"
            className='textAreaBox'
            value={messageText}
            onChange={({ target })=> setMessageText(target.value)}
            onKeyDown={textAreaSubmit}
          />
          <button type="submit" className="pb-1 submitMessageButton"><BsChat size="50%" /></button>
        </form>
      </div>
    </div>
  )
}

export default MessengerBar