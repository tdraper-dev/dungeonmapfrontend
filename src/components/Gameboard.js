import React, { useState, useRef, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useHistory, useLocation } from "react-router-dom"
import axios from 'axios'
import gameBoardService from '../services/gameboard'
import imageUtility from '../utils/imageHelper'
import LoadingSquare from './LoadingSquare'
import Icon from './Icon'
import MasterBuilderNav from './MasterBuilderBar.js'
import MessengerBar from './MessengerBar'
import socketServices from '../services/socketManager'
import iconService from '../services/icon'
import { useAuth } from '../services/use-auth'

function MapImageView(props) {
  
  return (
    <div className="mapImageView col-8 my-4 d-flex">
      <div className="imageBox py-1 px-1 py-md-5 px-md-5 d-flex">
        <div id="aspectRatioBox">
          {props.children}
        </div>
      </div>

    </div> 
  )
}

function MapTray({ mapSrc, loading, icons, setIcons, deleteIcon, updatePosition }) { 
  
  return (
    <div className="mapTrayContainer col-12   d-flex">
      <div id="dropZoneDelete" className="d-flex">
        <p className="pt-3">Delete</p>
      </div>
      {loading
        ? <LoadingSquare />
        : <MapImageView>
            {icons.map(icon => {
              return <Icon  
                  style={{backgroundColor: icon.color}}
                  content={icon.content}
                  id={icon.id}
                  key={icon.id}
                  position={icon.position}
                  setIcons={setIcons}
                  icons={icons}
                  deleteIcon={deleteIcon}
                  updatePosition={updatePosition}
                /> 
            })}
            <img draggable="false" className="noselect mapImage img-fluid" alt='' src={mapSrc} />
          </MapImageView>
      }
    </div>
  )
}


function Gameboard(props) {
  const [image64, setImage64] = useState('')
  const [icons, setIcons] = useState([])
  const [loading, setLoading] = useState(false)
  const [sessionLive, setSessionLive] = useState(false)
  const auth = useAuth()
  const boardId = props.match.params.id
  let history = useHistory();
  const location = useLocation();
  let guest = { id: '', username: ''}
  const messageRef = useRef();

  if (location.state) {
    guest = {
      id: location.state.id,
      username: location.state.username
    }
  }


  useEffect(() => {
    const source = axios.CancelToken.source()

    const loadGameBoard = async() => {
      try {
        setLoading(true)
        const gameBoard = await gameBoardService.getGameBoard(boardId, source.token)
        const boardImage = await imageUtility.convertBuffertoBlob(gameBoard.image.data)
        setImage64(boardImage)
        setIcons(gameBoard.icons)
        setLoading(false)
      } catch (exception) {
        console.log('loading mapImage failed', exception)
      }
    }
    const guestAuthorization = async() => {
      console.log("Authorizing guest. . .")
      socketServices.initiateGuestSocket(boardId, history, loadGameBoard)
    }

    if(auth.userId) {
      loadGameBoard();
    } else {
      guestAuthorization();
      console.log('I AM A GUEST')
      connectToSocket();
    }
    return () => {
      source.cancel()
      socketServices.disconnectSocket()
    }
  }, [])


  const connectToSocket = () => {
    if(sessionLive === false) {
      if(auth.userId) {
        socketServices.initiateDMSocket(boardId)
      }
      
      socketServices.addIcon((iconObj) => {
        setIcons(icons => [...icons, iconObj])
      })
  
      socketServices.updateIcon((position, id) => {
        setIcons((icons) => icons.map(icon => {
          if(icon.id === id) {
            icon.position.x = position.x
            icon.position.y = position.y
          }
          return icon
        }))
      })
  
      socketServices.clearIcon((id) => {
        console.log('removing this id', id)
        setIcons((icons) => icons.filter(icon => icon.id !== id))
      })
  
      socketServices.updateMap( async() => {
        setLoading(true)
        const gameBoard = await gameBoardService.getGameBoard(boardId)
        const boardImage = await imageUtility.convertBuffertoBlob(gameBoard.image.data)
        setImage64(boardImage)
        if(boardImage) {
          setLoading(false)
        }
      })
      console.log('YO I AM HERE!!!')
      setSessionLive(true)
    } else {
      socketServices.disconnectSocket()
      setSessionLive(false)
    }

  }

  const updateIcon = async(position, id) => {
    socketServices.moveIcon(position, id)
    const updatedIcon = await iconService.updateIcon(position, id)
    setIcons((icons) => icons.map(icon => {
      if(icon.id === id) {
        icon.position.x = position.x;
        icon.position.y = position.y;
      }
      return icon
    }))
  }

  const deleteIcon = async (id) => {
    await iconService.deleteIcon(id)
    socketServices.deleteIcon(id)
    setIcons((icons) => icons.filter(icon => icon.id !== id))
  }

  return (
    <>
    <div className="gameBoardRow row">
      <div className="backBox d-flex">
          <button className="buttons" onClick={() => history.goBack()}>
            {auth.userId ? 'Return to Dashboard' : 'Return Home'}
          </button>
      </div>
      {auth.userId 
        ?  <div className="sessionButtonBox d-flex">
              <button onClick={connectToSocket} className="buttons">
                {sessionLive ? 'End Session' : 'Start Session'}
              </button>
            </div>
        : null
      }
      <MapTray deleteIcon={deleteIcon}  mapSrc={image64} loading={loading} icons={icons} setIcons={setIcons} updatePosition={updateIcon} />
    </div>
    {auth.userId
      ?    <MasterBuilderNav
              setLoading={setLoading}
              boardId={boardId}
              setImage64={setImage64}
              icons={icons}
              setIcons={setIcons}
            />
      : null
    }
    <MessengerBar
        id={guest.id || auth.userId}
        username={guest.username || auth.username}
        session={sessionLive}
     />
    </>
  )
}


export default Gameboard

