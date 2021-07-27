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
      <Switch>
      <Route exact path="/"
        render={() => (
          auth.userId 
          ? <Redirect to='/dashboard' /> 
          : <Redirect to='/login' />
        )
      }
      />
        <Route path="/dashboard" component={Dashboard} />
        <Route path='/login' component={Login} />
        <Route path='/gameboard/:id' component={Gameboard} />
        <Route path='*' render={() => <Redirect to="/" />} />
      </Switch>
    </>
  )
}

export default Layout