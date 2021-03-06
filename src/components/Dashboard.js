import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BsXCircle, BsCheckCircle } from 'react-icons/bs'
import { useAuth } from '../services/use-auth'
import gameBoardService from '../services/gameboard'
import VisibleButton from './VisibleButton'
import axios from 'axios'
import imageUtility from '../utils/imageHelper'
import AddContentCircle from './AddContentCircle'
import LoadingSquare from './LoadingSquare'
import Icon from './Icon'
import { useNotify } from '../services/use-notification'
import { NotificationError } from './Notification'
import imageHelper from '../utils/imageHelper'


function LogoutButton() {
  const auth = useAuth()

  return (
    <div className="logoutBox optionItems px-1 py-1 col-6">
      <button className="buttons logOutButton" onClick={() => auth.logOut()}>Logout</button>
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

function BoardTile({ thisBoard, gameBoards, setBoards, setBoardId, loading, setLoading}) {
  const [thumbnail, setThumbnail] = useState('')
  const clickRef = useRef()

  const deleteGameboard = async() => {
    try {
      if (window.confirm('Do you want to delete this board?')) {
        setLoading(true)
        await gameBoardService.deleteGameBoard(thisBoard.boardPath)
        const newGameBoards = gameBoards.filter(board => board.id !== thisBoard.id)
        setBoards(newGameBoards)
        setLoading(false)
        if(newGameBoards.length > 0) {
          document.getElementsByClassName('thumbnailBox')[newGameBoards.length-1].click()
        }
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
    const thumbNailImage = imageUtility.convertBuffertoBlob(thisBoard.thumbnail.data)
        .then( response => setThumbnail(response))
        .catch( error => console.log(error) )

    document.getElementsByClassName('thumbnailBox')[0].click()
  }, [])

  return (
    <div ref={clickRef} className={`boardTile row ${thisBoard.board}`}>
      <div onClick={highlightClick}  className="boardTitle pe-0 d-flex col-4">
        <div className="boardTitleText">{thisBoard.board}</div>
      </div>
      <div onClick={highlightClick} className="thumbnailBox col-6 py-2 ps-3">
        <img alt="Gameboard Map minified view" draggable="false" className="thumbnailImage img-fluid" src={thumbnail} />
      </div>
      <div className="buttonContainer ps-0 pe-0 col-2 row">
        <PopUpNotice label='Delete Gameboard'className="ps-0 deleteButton">
          <BsXCircle className="deleteIcon" onClick={deleteGameboard}/>
        </PopUpNotice>
        <PopUpNotice label='Host Gameboard' className="ps-0  enterButton">
          <Link className="toGameboardLink" to={`/gameboard/${thisBoard.boardPath}`}>
            <BsCheckCircle className="enterIcon"/>
          </Link>
        </PopUpNotice>
      </div>
    </div>
  )
}

function BoardDisplay(props) {
  return (
    <div className="boardsDisplay">
      {props.children}
    </div>
  )
}

function CreateBoard({setVisible, createNewBoard}) {
  const [boardName, setBoardName] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const boxRef = useRef();
  const fileRef = useRef();
  const regTest = /image\/(png|jpeg)/
  const notify=useNotify()

  const handleSubmit = async (e) => {
    e.preventDefault()
    let file = fileRef.current.files[0]
    if(!file || regTest.test(file.type)) {
      const check = await createNewBoard(boardName, file)
      if(check) {
        setVisible(false)
      }
    } else {
      notify.notify({
        notification: 'Image file types accepted are .png or .jpeg',
        errorType: 'mapImage'
      })
    }
  }

  const checkForClick = (event) => {
    if(!boxRef.current || !boxRef.current.contains(event.target)) {
        setVisible(false)
    }
  }

  const preview = async() => {
    const file = fileRef.current.files[0]
    setImagePreview('')
    try {
      const newImage = await imageHelper.thumbnailPreviewBuilder(file)
      setImagePreview(newImage)
    } catch(error) {
      notify.notify({
        notification: error.notification,
        errorType: error.errorType
      })
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
      <form id="uploadFormDash" className="row py-3 px-3" encType='multipart/form-data' onSubmit={handleSubmit}>
        <label className="label newMapNameLabel">Board Name:</label>
        <input
          type="text"
          className="inputs pb-2 newMapName col-10 my-2"
          value={boardName}
          onChange={({ target }) => setBoardName(target.value)}
          required
          autoFocus
        />
        <label htmlFor="fileUploadDash" className="col-4 px-1 py-1 mb-2 fileUpload submitButtons buttons">Upload Image</label>
        <input
          type='file'
          className='inputs newMapName'
          ref={fileRef}
          id="fileUploadDash"
          name="file"
          onChange={preview}
        />
        {imagePreview
          ? <img alt="Thumbnail preview of map" src={imagePreview} className="imagePreview" />
          : null
        }
        <button className="col-6 mt-4 submitButtons buttons" type='submit'>Create</button>
        <NotificationError errorType='mapTitle' />
        <NotificationError errorType='mapImage' />
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
      <div className="dashTitle col-12">
        <p className="titleName">Dungeon Master:</p>
        <p className="titleName ms-2 ms-lg-0">{auth.username}</p>
        </div>
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

function MapImageView({ displayImage, boardId, icons }) {
  
  return (
    <div className="mapImageView col-9 col-md-8 d-flex">
      <div className="imageBox d-flex">
        <div id="aspectRatioBoxTray">
          {icons.map(icon => {
            return <Icon
              key={icon.id} 
              style={{backgroundColor: icon.color}} 
              content={icon.content}
              id={icon.id}
              position={icon.position}
              display={true}
              />
          })}
          <img draggable="false" className="dashMapImage mapImage img-fluid" key={boardId} alt='' src={displayImage} />
        </div>
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
  const [icons, setIcons] = useState([])
  const [loading, setLoading] = useState(true)
  const notify = useNotify();

  const createNewBoard = async(boardName, file) => {
    setLoading(true)
    try {
      const newBoard = {
        name: boardName,
        mapImage: file
      }
      const postedBoard = await gameBoardService.createGameBoard(newBoard)
      if(postedBoard) {
        await updateDashBoard(postedBoard)
        setBoards(boards.concat(postedBoard))
        setLoading(false)
        document.getElementsByClassName('thumbnailBox')[boards.length].click()
      }
    } catch (exception) {
      setLoading(false)
      console.log('OH NO!')
      notify.notify({
        notification: 'Please ensure no special characters in map name',
        errorType: 'mapTitle'
      })
      console.log(exception)
    }
  }

  const updateDashBoard = (board) => {
    imageUtility.convertBuffertoBlob(board.dashImage.data)
      .then(response => {
        setDisplayImage(response)
      })
      .catch(error => console.log('error with updating dash', error.message))
  }

  useEffect(() => {
    const source = axios.CancelToken.source()
    const getBoards = async() => {
      setLoading(true)
      try {
        const loadedBoards = await gameBoardService.getGameBoards(source.token);
        
        setBoards(loadedBoards)
        if(loadedBoards.length > 0) {
          if(loadedBoards[0].dashImage) {
            await updateDashBoard(loadedBoards[0])
            setIcons(loadedBoards[0].icons)
            setLoading(false)
          }
        } else {
          setLoading(false)
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
      setLoading(true)
      try {
        if(boards) {
          const boardFocus = boards.find(board => board.id === boardId)
          if(boardFocus && boardFocus.dashImage) {
            await updateDashBoard(boardFocus)
            setIcons(boardFocus.icons)
            setLoading(false)
          }
        } 
      } catch(exception) {
        console.log(exception)
      }
    }
    updateMapTile(boards)
    return () => updateMapTile()
  }, [boardId])


  const handleLinkClick = () => {
    document.getElementsByClassName('signUpButton')[0].click()
  }

  return (
    <div className="row dashboardRow">
      <SideBar>
        <UserBlock />
        <DmButtons>
          <VisibleButton label="Create" className="optionItems col-6 px-1 py-1 buttonFix">
            <CreateBoard createNewBoard={createNewBoard} />
          </VisibleButton>
          <LogoutButton />
        </DmButtons>
        <BoardDisplay> 
          {boards.map(board => ( 
            <BoardTile 
              key={board.id} 
              gameBoards={boards} 
              setBoards={setBoards} 
              thisBoard={board} 
              setBoardId={setBoardId}
              loading={loading}
              setLoading={setLoading}
            /> 
          ))}
        </BoardDisplay>
      </SideBar>
      <MapTray>
        {loading
          ? <LoadingSquare />
          :  boards.length > 0
              ? <MapImageView boardId={boardId} displayImage={displayImage} icons={icons} />
              : <div onClick={handleLinkClick} className="addContentBox">
                  <AddContentCircle color={'rgb(187, 0, 0)'}/>
                </div>
        }
      </MapTray>
      
    </div>
  )
}

export default Dashboard