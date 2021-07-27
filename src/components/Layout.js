import React, { useState } from 'react'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import { useAuth } from '../services/use-auth'
import Gameboard from './Gameboard'

function Layout() {
  const auth = useAuth()

  return (
    <>
      <Route path="/" render={() => (
        auth.userId 
          ? <Route path="/dashboard" component={Dashboard} /> 
          : <Route path='/login' component={Login} />
        )}
      /> 
      <Switch>
        <Route path='/gameboard/:id' component={Gameboard} />
      </Switch>
    </>
  )
}





export default Layout
