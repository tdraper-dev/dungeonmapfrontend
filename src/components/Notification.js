import React from 'react'
import { useNotify } from '../services/use-notification'

function NotificationError({errorType}) {
  const notify = useNotify()

  return (
    notify.message && notify.errorType === errorType
    ? <Notification type="errorMessage" notification={notify.message} />
    : null
  )
}

function NotificationSuccess({successType}) {
  const notify = useNotify()

  return (
    notify.message && notify.successType === successType
    ? <Notification type="successMessage" notification={notify.message} />
    : null
  )
}


function Notification({ notification, type }) {

  return (
    <div className={type}>
      {notification}
    </div>
  )
}

export { NotificationError, NotificationSuccess }