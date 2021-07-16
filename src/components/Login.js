import React, { useState } from 'react'
import useComponentVisible from './hookHelpers/useComponentVisible'



function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
 
    console.log('you tried to log in', username, password)
  }

  return (
    <form className="loginForm row" onSubmit={handleSubmit}>
      <input
          type='text'
          placeholder='Username'
          className="col-lg-4 col-md-6 col-8 mb-2"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        className="col-lg-4 col-md-6 col-8 mb-2"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <div className="col-lg-4 col-md-6 col-8 mb-2">
      <button type="submit">Login</button>
      </div>
    </form>
  )
}


function SignUpForm () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log('You tried to sign up!')
  }


  return (
    <div className="signUpBox pt-5">
      <form className="signUpForm row" onSubmit={handleSubmit}>
        <label className="col-lg-6 col-md-8 col-8 mb-2" >Username</label>
        <input
          type='text'
          className="col-lg-6 col-md-8 col-8 mb-2"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <label className="col-lg-6 col-md-8 col-8 mb-2">Password</label>
        <input
          type='password'
          className="col-lg-6 col-md-8 col-8 mb-2"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <label className="col-lg-6 col-md-8 col-8 mb-2">Confirm Password</label>
        <input
          type='password'
          className="col-lg-6 col-md-8 col-8 mb-2"
          value={passwordConfirm}
          onChange={({ target }) => setPasswordConfirm(target.value)}
        />
        <div className="col-lg-6 col-md-8 col-8 mb-2">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  )
}


function SignUpButton () {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  return (
    <div className="otherOptions col-6">
      <button className="signUpButton" onClick={toggleVisible}>Sign Up</button>
      { visible ?
        <SignUpForm />
        :
        null
      }
    </div>
  )
}

/*
function ToggleButton () {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }


  return (
    <div>hi</div>
  )
} */





function Login({ setUser }) {

  return (
    <div className='loginContainer row'>
      <div className='loginBox'>
        <h3>Login</h3>
          <LoginForm />
          <div className="row otherOptions">
          <SignUpButton />
          </div>
      </div>
  </div>
  )
}

export default Login