import React from 'react'
import { useNotify } from '../services/use-notification'

function NotificationError({errorType, style=null}) {
  const notify = useNotify()

  return (
    notify.message && notify.errorType === errorType
    ? <Notification style={style} type="errorMessage" notification={notify.message} />
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


function Notification({ notification, type, style }) {

  return (
    <div style={style} className={`noselect ${type}`}>
      {notification}
    </div>
  )
}

export { NotificationError, NotificationSuccess }