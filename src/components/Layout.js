import React, { useState } from 'react'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import Login from './Login'
import Dashboard from './Dashboard'

function Layout() {
  const [user, setUser] = useState(null)

  return (
    <Switch>
      <Route
      exact
      path="/"
      render={() => {
        return (
          user === null ?
          <Redirect to="/login" />:
          <Redirect to={'/dashboard/'+123} />
        )
      }}
    />
    <Route path="/login" component={Login} />
    <Route path ="/dashboard/:id" component={Dashboard} />
  </Switch>
  )
}

export default Layout