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
import { BsThreeDotsVertical } from 'react-icons/bs'

function MapImageView(props) {
  const  { float } = props
  return (
    <div className="gameboardMapImageView mapImageView col-11 d-flex">
      <div className={`${float? 'floating' : ''} gameboardImageBox d-flex`}>
        <div id="aspectRatioBoxBoard">
          {props.children}
        </div>
      </div>

    </div> 
  )
}

function MapTray({ mapSrc, loading, icons, setIcons, deleteIcon, updatePosition, float }) { 
  
  return (
    <div  className="mapTrayGameBoard col-12 d-flex">
      <div id="dropZoneDelete" className="d-flex">
        <p className="noselect pt-3">Delete</p>
      </div>
      {loading
        ? <LoadingSquare />
        : <MapImageView float={float}>
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
            <img draggable="false" id='gameBoardMap' className="noselect gameboardMapImage mapImage img-fluid" alt='' src={mapSrc} />
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
  const [float, setFloat] = useState(false)
  const auth = useAuth()
  const boardId = props.match.params.id
  let history = useHistory();
  const location = useLocation();
  let guest = { id: '', username: ''}

  if (location.state) {
    guest = {
      id: location.state.id,
      username: location.state.username
    }
  }


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
  function DropMenu({ userId, sessionLive }) {

    return (
      <div className="dropMenuContainer">
        <div className="dropTile my-2">
          <button className="noselect buttons" onClick={() => history.goBack()}>
            {auth.userId ? 'Return to Dashboard' : 'Return Home'}
          </button>
        </div>
        {auth.userId 
          ? <div className="noselect my-2 dropTile">
              <button onClick={connectToSocket} className="buttons">
                {sessionLive ? 'End Session' : 'Start Session'}
              </button>
            </div>
          : null
        }
        {sessionLive && auth.userId

        ? <div id="sessionIdBox"><span className="noselect">Session ID: </span>{boardId}</div>
        : null
        }
      </div>
    )

  }
  function DropDownNav({ sessionLive }) {
    const [visibility, setVisibility] = useState(false)
    const boxRef = useRef();
    const auth = useAuth();
    const authCheck = auth.userId ? auth.userId : null;

    const checkForClick = (event) => {
      if(!boxRef.current || !boxRef.current.contains(event.target)) {
          setVisibility(false)
      }
    }

    useEffect(() => {
      document.addEventListener('click', checkForClick)
      return () => {
        document.removeEventListener('click', checkForClick)
      }
    })

    return (
      <div ref={boxRef} onClick={() => setVisibility(true)} className={`${sessionLive ? 'activeBurger' : ''} ${visibility ? 'openMenu' : ''}`} id="hamburger">
        <BsThreeDotsVertical className="hide" size="20px" />
        {visibility
          ? <DropMenu userId={authCheck} sessionLive={sessionLive} />
          : null
        }
      </div>
    )
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


  return (
    <>
    <div className="gameBoardRow row">
      <DropDownNav sessionLive={sessionLive} />
      <MapTray 
        deleteIcon={deleteIcon} 
        mapSrc={image64} 
        loading={loading} 
        icons={icons} 
        setIcons={setIcons} 
        updatePosition={updateIcon}
        float={float}
      />
    </div>
    {auth.userId
      ?    <MasterBuilderNav
              setLoading={setLoading}
              boardId={boardId}
              setImage64={setImage64}
              icons={icons}
              setIcons={setIcons}
              float={float}
              setFloat={setFloat}
            />
      : null
    }
    <MessengerBar
        id={guest.id || auth.userId}
        username={guest.username || auth.username}
        session={sessionLive}
        float={float}
        setFloat={setFloat}
     />
    </>
  )
}


export default Gameboard

