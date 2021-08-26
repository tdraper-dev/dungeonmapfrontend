import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'
import { useAuth } from '../services/use-auth'
import Gameboard from './Gameboard'

function Layout() {
  const auth = useAuth()
  
  return (
    <>
    <Switch>
      <Route path='/gameboard/:id' component={Gameboard} />      
      <Route path="/" render={() => (
        auth.userId 
          ? <Redirect from='/' to='/dashboard' /> 
          : <Redirect from='/' to='/login' />
        )}
      /> 
    </Switch>

      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path='/login' component={Login} />
      </Switch>
    </>
  )
}





export default Layout
