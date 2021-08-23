import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../services/use-auth'
import { useNotify } from '../services/use-notification'
import { NotificationError, NotificationSuccess } from './Notification'
import socketServices from '../services/socketManager'

function JoinSession() {
  const [sessionID, setSessionID] = useState('')
  const [username, setUsername] = useState('')
  const history = useHistory()
  const notify = useNotify();

  const quickCheck = (sessionID) => {
    return (
      history.push({
        pathname: `/gameboard/${sessionID}`,
        from: '/',
        state: {
          username: username,
          id: Math.random()
        }
      })
    )
  }


  const handleSubmit = (e) => {
    e.preventDefault()
    const checkName = /(\$|{|}|\/|\\|\*|\(|\)\`)+/g.test(username)
    const checkSession = /(\$|{|}|\/|\\|\*|\(|\)\`)+/g.test(username)

    if(!checkName && !checkSession && sessionID && username) {
      socketServices.guestQuickCheck(sessionID, notify, quickCheck);
    } else {
      notify.notify({
        notification: 'Please ensure no special characters in name and valid sessionID',
        errorType: 'guestJoin'
      })
    }
  }

  return (
    <form className="formContainer row" onSubmit={handleSubmit}>
      
      <label className="label col-lg-7 col-md-6 col-8 mb-2">Player Name</label>
      <input
        type="text"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        className="submitButtons col-lg-6 col-md-6 col-8 mb-2 inputs"
        />
      <label className="label col-lg-7 col-md-6 col-8 mb-2">Session ID</label>
      <input
        type="text"
        value={sessionID}
        onChange={({ target }) => setSessionID(target.value)}
        className="submitButtons col-lg-6 col-md-6 col-8 mb-2 inputs"
        />
      <div className="notifyBoxes col-lg-6 col-md-6 col-8 mb-2">
        <button className="buttons" type="submit">Join</button>
        <NotificationError errorType='guestJoin' />
      </div>
    </form>
  )
}


function LoginForm () {
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
    <form className="formContainer row" onSubmit={handleSubmit}>
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

function SignUp({ handleSignUp }) {
  const[username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
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
 
  return (
    <form className="formContainer row" onSubmit={handleSubmit}>
      <label className="label col-lg-6 col-md-8 col-8 mb-2" >Username</label>
      <input
        type='text'
        className="col-lg-6 col-md-8 col-8 mb-2 inputs"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
      />
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
        <NotificationError errorType='usernameLength' />
      </div>
    </form> 
  )
}

function SignUpForm () {
  const notify = useNotify();
  const auth = useAuth()

  const handleSignUp = async (username, password) => {
    try {
      const newUser = { username, password }
      const response = await auth.signUp(newUser)
      if(response) {
        notify.notify({
          notification: `New user ${username} created!`,
          successType: 'userCreated'
        })
      }
    } catch (exception) {
      notify.notify({
        notification: 'Username taken or under 5 character mininmum length',
        errorType: 'usernameLength'
      })
      console.log(exception)
    }
  }
  return (
      <SignUp handleSignUp={handleSignUp} />
  )
}

const OptionButton = ({ handleClick, value }) => {

  return (
    <button value={value} onClick={handleClick} className="optionItems px-2 py-1 buttons">
      {value}
    </button>
  )
}

const DemoButton = () => {
  const auth = useAuth()

  const handleClick = () => {
    try {
      const user = {
        username: 'Travis Draper',
        password: 'travis'
      }
      auth.logIn(user)
    } catch (exception) {
      console.log(exception)
      
    }
  }

  return (
    <button className="optionItems px-1 py-1 mb-2 buttons" onClick={handleClick}>
      Demo
    </button>
  )
}

function Login() {
  const [field, setField] = useState('Login')

  const handleClick = ({ target }) => {
    setField(target.value)
  }

  return (
    <div id="background">
    <h1 className="noselect loginTitle">
        Dungeon Map!
    </h1>
    <div className='loginContainer row mx-3'>
      <div className='loginBox notifyBoxes d-flex'>
        <h2 className="noselect titles formTitle">Login</h2>
        <div className="formBoxContainer py-5">

        {field === 'Login' ? <LoginForm /> : null}
        {field === 'Join Session' ? <JoinSession /> : null}
        {field === 'Sign Up' ? <SignUpForm /> : null}

        </div>
        <div className=" otherOptions d-flex mt-4 mx-2">
          <OptionButton value="Login" handleClick={handleClick} />
          <OptionButton value="Sign Up" handleClick={handleClick} />
          <OptionButton value="Join Session" handleClick={handleClick} />
        </div>
        <DemoButton />
          
      </div>

  </div>
  </div>
  )
}

export default Login