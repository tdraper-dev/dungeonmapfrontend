import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { io } from 'socket.io-client'




function SecondPage () {

  /*const server="http://localhost:3001"
  const secondSocket = io.connect(`${server}/second`)

  useEffect(() => {
    secondSocket.connect()
    secondSocket.on('welcome', (message) => {
      console.log('I RECEIVED THIS MESSAGE: ', message)
    })
    //console.log(secondSocket)
    //firstSocket.emit('Hello_there', null);

    //firstSocket.on('Welcome from server', () => {
      //console.log('I am connected with the backend')
    //});

    return () => {
      secondSocket.disconnect()
      //console.log(secondSocket)
    }
  }, [])*/
  return (
    <div>Hello, Second Page</div>
  )
}


export default SecondPage