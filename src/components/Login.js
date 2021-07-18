import React, { useState, useEffect, useRef } from 'react'
import { Switch, Route, Link, Redirect, useHistory } from 'react-router-dom'
import { useAuth } from '../services/use-auth'
import { useNotify } from '../services/use-notification'
import { NotificationError, NotificationSuccess } from './Notification'

function JoinSession({ setVisible }) {
  const [sessionID, setSessionID] = useState('')
  const history = useHistory()

  const checkForClick = (event) => {
    if(!boxRef.current || !boxRef.current.contains(event.target)) {
      setVisible(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', checkForClick)
    return () => {
      document.removeEventListener('click', checkForClick)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setVisible(false);
    console.log('you tried to join a session')
    return (
      history.push('/gameboard/:id', {from: '/login'})
    )
  }

  const boxRef = useRef()
  return (
    <div className="joinSessionBox">
    <form ref={boxRef} className="signUpForm row pt-3" onSubmit={handleSubmit}>
      <label className="label col-lg-7 col-md-6 col-8 mb-2">Session ID</label>
      <input
        type="text"
        value={sessionID}
        onChange={({ target }) => setSessionID(target.value)}
        className="submitButtons col-lg-6 col-md-6 col-8 mb-2 inputs"
        />
        <button className="col-lg-4 col-md-6 col-8 mb-2 submitButtons buttons" type="submit">Join!</button>
    </form>
  </div>
  )
}


function LoginForm({ setUser }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const auth = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const user = {
        username,
        password
      }
      auth.logIn(user)
    } catch (exception) {
      console.log(exception)
      
    }
  }

  return (
    <form className="loginForm row py-5" onSubmit={handleSubmit}>
      <label className="label col-lg-6 col-md-6 col-8">Username</label>
      <input
          type='text'
          placeholder='Username'
          className="col-lg-6 col-md-6 col-8 mt-2 mb-4 inputs"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
      />
      <label className="label col-lg-6 col-md-6 col-8">Password</label>
      <input
        type='password'
        placeholder='Password'
        className="col-lg-6 col-md-6 col-8 mt-2 mb-4 inputs"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <div className="notifyBoxes col-lg-6 col-md-6 col-8 mb-2">
        <button className="buttons" type="submit">Login</button>
        <NotificationError errorType='badCredentials' />
      </div>
    </form>
  )
}

function SignUp({ setVisible, handleSignUp }) {
  const[username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const boxRef = useRef()
  const notify = useNotify();

  const handleSubmit = (e) => {
    e.preventDefault()

    if(password === passwordConfirm) {
      handleSignUp(username, password)
    } else {
      notify.notify({
        notification: 'Please ensure passwords match',
        errorType: 'passwordMatch'
      })
    }
  }

  const checkForClick = (event) => {
    if(!boxRef.current || !boxRef.current.contains(event.target)) {
        setVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', checkForClick)
    return () => {
      document.removeEventListener('click', checkForClick)
    }
  })
 
  return (
    <form ref={boxRef} className="signUpForm row pt-3" onSubmit={handleSubmit}>
      <label className="label col-lg-6 col-md-8 col-8 mb-2" >Username</label>
      <input
        type='text'
        className="col-lg-6 col-md-8 col-8 mb-2 inputs"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
        <NotificationError errorType='usernameLength' />
      <label className="label col-lg-6 col-md-8 col-8 mb-2">Password</label>
      <input
        type='password'
        className="col-lg-6 col-md-8 col-8 mb-2 inputs"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <label className="label col-lg-6 col-md-8 col-8 mb-2">Confirm Password</label>
      <input
        type='password'
        className="col-lg-6 col-md-8 col-8 mb-2 inputs"
        value={passwordConfirm}
        onChange={({ target }) => setPasswordConfirm(target.value)}
      />
      <div className="notifyBoxes col-lg-6 col-md-8 col-8 mb-2 pt-2">
        <button className="buttons" type="submit">Sign Up</button>
        <NotificationError errorType='passwordMatch' />
      </div>
    </form> 
  )
}

function SignUpForm ({ setVisible }) {
  const notify = useNotify();
  const auth = useAuth()

  const handleSignUp = async (username, password) => {
    try {
      const newUser = { username, password }
      const response = await auth.signUp(newUser)
      if(response) {
        setVisible(false);
        notify.notify({
          notification: `New user ${username} created!`,
          successType: 'userCreated'
        })
      }
    } catch (exception) {
      notify.notify({
        notification: 'Please ensure username is at least 5 characters in length',
        errorType: 'usernameLength'
      })
      console.log(exception)
    }
  }
  return (
    <div className="signUpBox">
      <SignUp setVisible={setVisible} handleSignUp={handleSignUp} />
    </div>
  )
}


function OptionButton (props) {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  return (
    <div className="optionItems px-1 py-1">
      <button onClick={toggleVisible} className="buttons signUpButton">{props.label}</button>
      { visible ? React.cloneElement(props.children, { ...props, setVisible: setVisible })
        : null
      }
      
    </div>
  )
}



function Login() {

  return (
    <div id="background">
    <h1 className="loginTitle">
        Dungeon Map!
    </h1>
    <div className='loginContainer row mx-3'>
      <div className='loginBox notifyBoxes d-flex'>
        <h2 className="titles formTitle">Login</h2>
          <LoginForm />
          <div className=" otherOptions d-flex mx-2">
          <OptionButton label="Sign Up">
            <SignUpForm />
          </OptionButton>
          <OptionButton label="Join Game">
            <JoinSession />
          </OptionButton>
          </div>
          <NotificationSuccess successType="userCreated" />
      </div>

  </div>
  </div>
  )
}

export default Login