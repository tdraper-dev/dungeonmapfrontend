import React, { useState } from 'react'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import { useAuth } from '../services/use-auth'
import axios from 'axios'
import FileBase64 from "react-file-base64"

function Gameboard() {
  const [image64, setImage64] = useState('')
    

  const onFileChange = (e) => {
    setImage64()
  }

  console.log('image64: ', image64)
  return (
    <>
    <FileBase64
      multiple={false}
      onDone={({ base64 }) => setImage64(base64)} />
    <div className="row apple mapRow">
      <div className="col-8 mapBox">
        <img className="img-fluid cake" src={image64} />
      </div>
    </div>
    
    </>
  )
}

function Layout() {
  const auth = useAuth()

  return (
    <>
      <Route path="/"
        render={() => (
          auth.userId 
          ? <Redirect to='/dashboard' /> 
          : <Redirect to='/login' />
        )
      }
      />
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path='/login' component={Login} />
        <Route path='/gameboard/:id' component={Gameboard} />
      </Switch>
    </>
  )
}

export default Layout