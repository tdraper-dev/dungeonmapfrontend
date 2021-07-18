import React, { useState, useEffect, useContext, createContext } from 'react'
import { NotificationError } from '../components/Notification'

const notifyContext = createContext()

export function ProvideNotify({ children }) {
  const notify = useProvideNotify();
  return <notifyContext.Provider value={notify}>{children}</notifyContext.Provider>
}

export const useNotify = () => {
  return useContext(notifyContext)
}

function useProvideNotify() {
  const[message, setMessage] = useState('')
  const[errorType, setErrorType] = useState('')
  const[successType, setSuccessType] = useState('')

  const notify = ({notification, errorType, successType }) => {
    console.log(notification)
    setMessage(notification)
    setErrorType(errorType || '')
    setSuccessType(successType || '')

    setTimeout(() => {
      setMessage('')
      setErrorType('')
      setSuccessType('')
    }, 2000)
  }

  const notificationAlert = (suppliedError) => {
    console.log(suppliedError)
    return (
      suppliedError === errorType
        ? <NotificationError notification={message} />
        : null   
    )
  }


  return {
    message,
    errorType,
    successType,
    notify,
    notificationAlert
  }
}

