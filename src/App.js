import React, { useState, useEffect } from 'react'
import socketClient from 'socket.io-client'
import logo from './logo.svg';
import './App.css';
import axios from 'axios'

const server="http://localhost:3001"
const socket = socketClient(server)


function App() {
  const [notes, setNotes] = useState([])
  const [connected, setConnected] = useState(false)

  socket.on('updated-content', (res) => {
    setNotes(res)
  })
  
  useEffect(() => {
    socket.emit('Hello_there', null);
    const eventHandler = () => setConnected(true)

    socket.on('Welcome from server', () => {
      console.log('I am connected with the backend')
      eventHandler()
    });

    return () => {
      socket.off('Welcome from server', eventHandler)
    }
  }, [])

  useEffect(() => {
    const getAllNotes = async() => {
      const notes = await axios.get('/api/notes')
      setNotes(notes.data)
    }

    getAllNotes()
  },[])

  
  const testThis = async () => {
    const newNote = {
      content: 'This is another test!',
      date: new Date(),
      important: false
    }
    await axios.post('/api/notes', newNote)

  }

  
  return (
    <div className="App">
      <button onClick={testThis}>Test</button>
      {notes.map(note => (
        <div key={note.id}>{note.content}</div>
      ))}
    </div>
  );
}

export default App;
