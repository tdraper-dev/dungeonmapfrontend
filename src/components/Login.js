import React, { useState, useEffect, useRef } from 'react'
import useComponentVisible from '../hookHelpers/useComponentVisible'


function JoinSession({ setVisible }) {
  const [sessionID, setSessionID] = useState('')

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
  }

  const boxRef = useRef()
  return (
    <div className="joinSessionBox">
    <form ref={boxRef} className="signUpForm row pt-3" onSubmit={handleSubmit}>
      <label className="col-lg-7 col-md-6 col-8 mb-2">Session ID</label>
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


function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
 
    console.log('you tried to log in', username, password)
  }

  return (
    <form className="loginForm row py-5" onSubmit={handleSubmit}>
      <label className="col-lg-6 col-md-6 col-8">Username</label>
      <input
          type='text'
          placeholder='Username'
          className="col-lg-6 col-md-6 col-8 mt-2 mb-4 inputs"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
      />
      <label className="col-lg-6 col-md-6 col-8">Password</label>
      <input
        type='password'
        placeholder='Password'
        className="col-lg-6 col-md-6 col-8 mt-2 mb-4 inputs"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
      />
      <div className="col-lg-6 col-md-6 col-8 mb-2">
      <button className="buttons" type="submit">Login</button>
      </div>
    </form>
  )
}


function SignUpForm ({ setVisible, testRef }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  console.log(testRef)
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('You tried to sign up!')
    setVisible(false);
  }

  const boxRef = useRef()
  
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
    <div className="signUpBox">
      <form ref={boxRef} className="signUpForm row pt-3" onSubmit={handleSubmit}>
        <label className="col-lg-6 col-md-8 col-8 mb-2" >Username</label>
        <input
          type='text'
          className="col-lg-6 col-md-8 col-8 mb-2 inputs"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <label className="col-lg-6 col-md-8 col-8 mb-2">Password</label>
        <input
          type='password'
          className="col-lg-6 col-md-8 col-8 mb-2 inputs"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <label className="col-lg-6 col-md-8 col-8 mb-2">Confirm Password</label>
        <input
          type='password'
          className="col-lg-6 col-md-8 col-8 mb-2 inputs"
          value={passwordConfirm}
          onChange={({ target }) => setPasswordConfirm(target.value)}
        />
        <div className="col-lg-6 col-md-8 col-8 mb-2 pt-2">
          <button className="buttons" type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  )
}


function OptionButton (props) {
  const [visible, setVisible] = useState(false)
  const toggleVisible = () => {
    setVisible(!visible)
  }
  const testRef = useRef();

  return (
    <div className="optionItems col-6">
      <button onClick={toggleVisible} className="buttons signUpButton">{props.label}</button>
      { visible ? React.cloneElement(props.children, { ...props, setVisible: setVisible, ref: testRef })
        : null
      }
      
    </div>
  )
}



function Login({ setUser }) {

  return (
    <>
    <h1 className="loginTitle">Dungeon Map!</h1>
    <div className='loginContainer row mx-3'>
      <div className='loginBox d-flex'>
        <h2 className="titles formTitle">Login</h2>
          <LoginForm />
          <div className=" otherOptions d-flex">
          <OptionButton label="Sign Up">
            <SignUpForm />
          </OptionButton>
          <OptionButton label="Join Game">
            <JoinSession />
          </OptionButton>
          </div>
      </div>
  </div>
  </>
  )
}

export default Login