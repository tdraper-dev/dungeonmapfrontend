import React, { useState, useEffect } from 'react'
import { browserHistory as Router, Switch, Route, Link } from 'react-router-dom'
import { io } from 'socket.io-client'



function FirstPage () {

  /*const server="http://localhost:3001"
  const firstSocket = io.connect(server, {
    'reconnect': false
  })*/

  /*useEffect(() => {
    firstSocket.connect()
    firstSocket.on('welcome', (message) => {
      console.log('I RECEIVED THIS MESSAGE: ', message)
    })
    //console.log(firstSocket)
    //firstSocket.emit('Hello_there', null);

    //firstSocket.on('Welcome from server', () => {
      //console.log('I am connected with the backend')
    //});

    return () => {
      firstSocket.disconnect()
      //console.log(firstSocket)
    }
  }, [])*/

  return (
    <div>Hello, First Page</div>
  )
}


export default FirstPage