import React, { useState, useEffect } from 'react'
import './App.css';
import { browserHistory as Router } from 'react-router-dom'
import Layout from './components/Layout'
import { ProvideAuth } from './services/use-auth'
import { ProvideNotify } from './services/use-notification'


/*{user ?
  <Dashboard user={user} setUser={setUser} />
  : <div id="background">
      <Login setUser={setUser} />
  </div>
}*/

function App() {

  return (
    <Router>
      <ProvideNotify>
        <ProvideAuth>
          <Layout />
        </ProvideAuth>
      </ProvideNotify>

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