import React, { useState } from 'react'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import { useAuth } from '../services/use-auth'


function Layout() {
  const auth = useAuth()

  return (
    <>
      <Route path="/"
        render={() => (
          auth.userId 
          ? <Redirect to={`/dashboard/${auth.userId}`}/> 
          : <Redirect to='/login' />
        )
      }
      />
      <Switch>
        <Route path="/dashboard/:id" component={Dashboard} />
        <Route path='/login' component={Login} />
      </Switch>
    </>
  )
}

export default Layout