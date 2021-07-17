import React, { useState } from 'react'
import './App.css';
import axios from 'axios'
import { BrowserRouter as Router } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './components/Login'




function App() {
  const [user, setUser] = useState(null)


  return (
    <Router>
        {user ?
        <div>Hello World </div>
        : <div id="background">
            <Login setUser={setUser} />
          </div>
        }
    </Router>
  );
}

export default App;
/*
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
  
      <div className="App">
      <button onClick={testThis}>Test</button>
      {notes.map(note => (
        <div key={note.id}>{note.content}</div>
      ))}
    </div>

  */