import React, { useState, useEffect, useContext, createContext } from 'react'
import loginService from './login'
import gameBoardService from './gameboard'
import signUpService from '../services/signup'
import { useNotify } from '../services/use-notification'


const authContext = createContext();

export function ProvideAuth({  children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [userId, setUserId] = useState(null)
  const [username, setUsername ] = useState('')
  const notify = useNotify()

  const logIn = async (user) => {
    try {
      const loggedUser = await loginService.login(user)
      window.localStorage.setItem(
        'loggedDungeonMaster', JSON.stringify(loggedUser)
      )

      gameBoardService.setToken(loggedUser.token)

      setUserId(loggedUser.id)
      setUsername(loggedUser.username)
    } catch(exception) {
      notify.notify({
        notification: 'Username or Password Incorrect',
        errorType: 'badCredentials'
      })
      console.log('failure in useProvideAuth.logIn()', exception)
    }
  }

  const logOut = async () => {
    try {
      window.localStorage.removeItem('loggedDungeonMaster')
      gameBoardService.setToken(null)

      setUserId(null)
      setUsername('')
    } catch(exception) {
      console.log('failed to logout', exception);
    }
  }

  const signUp = async (newUser) => {
    const response = await signUpService.createUser(newUser)
    return response
  }

  useEffect(() => {
    const setToken = () => {
      const loggedUserJson = window.localStorage.getItem('loggedDungeonMaster')
      if(loggedUserJson) {
        const user = JSON.parse(loggedUserJson)
        setUserId(user.id)
        setUsername(user.username)
        gameBoardService
          .setToken(user.token)
      }
    }
    setToken()
    return () => {
      setToken()
    }
  }, [userId])

  return {
    username,
    userId,
    logIn,
    logOut,
    signUp
  }
}