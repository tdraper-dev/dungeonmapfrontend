import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useAuth } from '../services/use-auth'

function PrivateRoute({children, ...rest}) {
  const auth = useAuth()
  return (
    <Route
      render={() => (
        auth.userId
          ? children
          : <Redirect
              to='/login'
            />
      )}
    />
  )
}

export default PrivateRoute