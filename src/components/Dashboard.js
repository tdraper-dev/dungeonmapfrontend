import React, { useState } from 'react'
import { Switch, Route, Link, Redirect, useRouteMatch } from 'react-router-dom'

function Dashboard(props) {

  console.log(props.match.params.id)
  return (
    <div className="d-flex">{props.match.params.id}</div>
  )
}

export default Dashboard