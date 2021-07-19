import React, { useState, useEffect, useRef } from 'react'
import { Switch, Route, Link, Redirect, useRouteMatch } from 'react-router-dom'
import { BsXCircle, BsCheckCircle, BsMicFill } from 'react-icons/bs'
import { useAuth } from '../services/use-auth'
import gameBoardService from '../services/gameboard'
import VisibleButton from './VisibleButton'
import axios from 'axios'


function LogoutButton() {
  const auth = useAuth()

  return (
    <div className="logoutBox optionItems px-1 py-1 col-6">
      <button className="buttons signUpButton" onClick={() => auth.logOut()}>Logout</button>
    </div>
  )
}


function PopUpNotice(props) {
  const [visible, setVisible] = useState(false)
  const { label, className } = props

  return (
    <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} className={`${className} my-2`}>
      {props.children}
      {visible ? <div className='popUpVisible'>{label}</div> : null }
    </div>
  )
}

function BoardTile({thisBoard, gameBoards, setBoards}) {

  const deleteGameboard = async() => {
    try {
      if (window.confirm('Do you want to delete this board?')) {
        await gameBoardService.deleteGameBoard(thisBoard.id)
        setBoards(gameBoards.filter(board => board.id !== thisBoard.id))
      }
    } catch (exception) {
      console.log(exception)
    }
    
  }

  return (
    <div className="boardTile row">
      <div className="boardTitle col-10">
        <div className="boardTitleText mt-4">{thisBoard.board}</div>
      </div>
      <div className="buttonContainer col-2 row">
        <PopUpNotice label='Delete Gameboard'className="deleteButton">
          <BsXCircle className="deleteIcon" onClick={deleteGameboard}/>
        </PopUpNotice>
        <PopUpNotice label='Host Gameboard' className="enterButton">
          <Link className="toGameboardLink" to={`/gameboard/${thisBoard.id}`}>
            <BsCheckCircle className="enterIcon"/>
          </Link>
        </PopUpNotice>
      </div>
    </div>
  )
}

function BoardDisplay({gameBoards, setBoards}) {

  return (
    <div className="boardsDisplay">
      {gameBoards.map(board => ( 
        <BoardTile key={board.id} gameBoards={gameBoards} setBoards={setBoards} thisBoard={board} /> 
      ))}
    </div>
  )
}

function CreateBoard({setVisible, createNewBoard}) {
  const [boardName, setBoardName] = useState('')
  const boxRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createNewBoard(boardName)
      setVisible(false)
    } catch (exception) {
      console.log(exception)
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

  return(
    <div ref={boxRef} className="newBoardFormBox popUpBoxes py-2 px-2">
      <form onSubmit={handleSubmit}>
        <label className="label newMapNameLabel">Board Name:</label>
        <input
          type="text"
          className="inputs newMapName my-2"
          value={boardName}
          onChange={({ target }) => setBoardName(target.value)}
          autoFocus
        />
      </form>
    </div>
  )
}

function DmButtons(props) {

  return (
    <div className="dmButtonsBox d-flex">
      {props.children}
    </div>
  )
}

function UserBlock() {
  const auth = useAuth()

  return (
    <div className="userBlock pt-1 pb-1 pt-lg-3 pb-lg-3 row">
      <div className="dashTitle col-12">Dungeon Master: <br />{auth.username}</div>
    </div>
  )
}

function SideBar(props) {

  return (
    <div className="sideBarColumn col-12 col-lg-2 d-flex">
      {props.children}
    </div>
  )
}

function MapImageView() {

  return (
    <div className="mapImageView col-8 my-4 d-flex">
      <div className="imageBox py-1 px-1 py-md-5 px-md-5 d-flex">
        <img className="mapImage img-fluid" alt='' src="https://d20.pub/assets/uploads/2018/03/Simple-battlemap-for-Hoard-of-the-Dragon-Queen-Dungeons-and-Dragons-Adventure-Module-Part-1-Keep-in-Greenest-on-Fire.jpg" />
      </div>

    </div> 
  )
}

function MapTray() {

  return (
    <div className="mapTrayContainer col-12 col-lg-10  d-flex">
      <MapImageView />
    </div>
  )
}

function Dashboard() {
  const [boards, setBoards] = useState([])


  const createNewBoard = async(boardName) => {
    try {
      const newBoard = {
        board: boardName
      }
      const postedBoard = await gameBoardService.createGameBoard(newBoard)
      if(postedBoard) {
        setBoards(boards.concat(postedBoard))
      }
    } catch (exception) {
      console.log(exception)
    }
  }

  useEffect(() => {
    const source = axios.CancelToken.source()
    const getBoards = async() => {
      try {
        const loadedBoards = await gameBoardService.getGameBoards(source.token);
        setBoards(loadedBoards)
      } catch(exception) {
        console.log(exception)
      }
    }
    getBoards()
    return () => {source.cancel()}
  }, [])

  return (
    <div className="row dashboardRow">
      <SideBar>
        <UserBlock />
        <DmButtons>
          <VisibleButton label="Add Board" className="optionItems col-6 px-1 py-1 buttonFix">
            <CreateBoard createNewBoard={createNewBoard} />
          </VisibleButton>
          <LogoutButton />
        </DmButtons>
        <BoardDisplay setBoards={setBoards} gameBoards={boards} />
      </SideBar>
      <MapTray />
    </div>
  )
}

export default Dashboard