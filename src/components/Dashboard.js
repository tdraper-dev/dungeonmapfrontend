import React, { useState, useEffect, useRef } from 'react'
import { Switch, Route, Link, Redirect, useRouteMatch } from 'react-router-dom'
import { BsXCircle, BsCheckCircle, BsMicFill } from 'react-icons/bs'
import { useAuth } from '../services/use-auth'
import gameBoardService from '../services/gameboard'
import imageService from '../services/image'
import VisibleButton from './VisibleButton'
import axios from 'axios'
import imageUtility from '../utils/imageHelper'
import LoadingCircle from './LoadingCircle'


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

function BoardTile({thisBoard, gameBoards, setBoards, setBoardId}) {
  const clickRef = useRef()

  const deleteGameboard = async() => {
    try {
      if (window.confirm('Do you want to delete this board?')) {
        await gameBoardService.deleteGameBoard(thisBoard.id)
        const newGameBoards = gameBoards.filter(board => board.id !== thisBoard.id)
        setBoards(newGameBoards)

      }
    } catch (exception) {
      console.log(exception)
    }
  }

  const highlightClick = (e) => {
    setBoardId(thisBoard.id)
    if(!clickRef.current.hasAttribute('id')) {
      const oldSelect = document.getElementById('highlightSelect')
      if(oldSelect) { 
        oldSelect.removeAttribute('id') 
      }
      clickRef.current.setAttribute('id', 'highlightSelect')
    }
  }

  useEffect(() => {
    const boardWithImage = gameBoards.find(board => board.hasOwnProperty('mapImage'))
    if(boardWithImage) {
      document.getElementsByClassName(`${boardWithImage.board}`)[0].click()
    } else {
      document.getElementsByClassName('boardTile')[0].click()
    }
  }, [])

  return (
    <div ref={clickRef} onClick={highlightClick} className={`boardTile row ${thisBoard.board}`}>
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

function BoardDisplay({gameBoards, setBoards, setBoardId}) {

  return (
    <div className="boardsDisplay">
      {gameBoards.map(board => ( 
        <BoardTile key={board.id} gameBoards={gameBoards} setBoards={setBoards} thisBoard={board} setBoardId={setBoardId} /> 
      ))}
    </div>
  )
}

function CreateBoard({setVisible, createNewBoard}) {
  const [boardName, setBoardName] = useState('')
  const boxRef = useRef();
  const fileRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log(fileRef.current.files[0])
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
      <form id="uploadFormDash" encType='multipart/form-data' onSubmit={handleSubmit}>
        <label className="label newMapNameLabel">Board Name:</label>
        <input
          type="text"
          className="inputs newMapName my-2"
          value={boardName}
          onChange={({ target }) => setBoardName(target.value)}
          autoFocus
        />
        <label htmlFor="fileUploadDash" className="fileUpload">Upload Image</label>
        <input
          type='file'
          className='inputs newMapName my-2'
          ref={fileRef}
          id="fileUploadDash"
          name="file"
        />
        <button type='submit'>Create</button>
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

function MapImageView({ displayImage }) {


  return (
    <div className="mapImageView col-8 my-4 d-flex">
      <div className="imageBox py-1 px-1 py-md-5 px-md-5 d-flex">
        <img className="mapImage img-fluid" alt='' src={displayImage} />
      </div>

    </div> 
  )
}

function MapTray(props) {

  return (
    <div className="mapTrayContainer col-12 col-lg-10  d-flex">
      {props.children}
    </div>
  )
}

function Dashboard() {
  const [boards, setBoards] = useState([])
  const [boardId, setBoardId] = useState('')
  const [displayImage, setDisplayImage] = useState(null)


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
        if(loadedBoards.length >= 1) {
          if(loadedBoards[0].mapImage) {
          imageUtility.convertBuffertoBlob(loadedBoards[0].mapImage.img.data)
            .then( response => setDisplayImage(response))
            .catch( error => console.log(error) )
          }
        } 
      } catch(exception) {
        console.log(exception)
      }
    }
    getBoards()
    return () => {source.cancel()}
  }, [])


  useEffect(() => {
    const updateMapTile = async(boards) => {
      try {
        if(boards) {
          const boardFocus = boards.find(board => board.id === boardId)
          if(boardFocus && boardFocus.mapImage) {
            imageUtility.convertBuffertoBlob(boardFocus.mapImage.img.data)
              .then( response => {
                setDisplayImage(response) 
              })
              .catch(error => {
                console.log(error)
              })
          }
        } else {
          setDisplayImage(null)
        }
      } catch(exception) {
        console.log(exception)
      }
    }
    updateMapTile(boards)
    return () => updateMapTile()
  }, [boardId])


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
        <BoardDisplay setBoards={setBoards} gameBoards={boards} setBoardId={setBoardId} />
      </SideBar>
      <MapTray>
        {!displayImage
          ? <Link onClick={boardId ? null : ()=>console.log('yo')} className="hidden" to={boardId ? `/gameboard/${boardId}` : '/dashboard'}>
              <LoadingCircle color={'rgb(187, 0, 0)'}/>
            </Link>
          : <MapImageView displayImage={displayImage} />
        }
      </MapTray>
      
    </div>
  )
}

export default Dashboard