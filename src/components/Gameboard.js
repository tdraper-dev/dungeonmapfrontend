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
import { useNotify } from '../services/use-notification'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { NotificationSuccess, NotificationError } from './Notification'
import WornMap from '../images/wornMap(resized).jpg'


function MapImageView(props) {
  const  { float } = props
  return (
    <div className="gameboardMapImageView mapImageView col-11 d-flex">
      <div className={`${float? 'floating' : ''} gameboardImageBox mt-3 mb-5 d-flex`}>
        <div id="aspectRatioBoxBoard">
          {props.children}
        </div>
      </div>

    </div> 
  )
}

function MapTray({ mapSrc, loading, icons, setIcons, deleteIcon, updatePosition, float }) { 
  
  return (
    <div  className="mapTrayGameBoard col-12 py-5 px-5 d-flex">
      <div title="Drag items here to delete" id="dropZoneDelete" className="d-flex">
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
            <img draggable="false" id='gameBoardMap' className="noselect gameboardMapImage mapImage img-fluid" alt='' src={mapSrc || WornMap} />
          </MapImageView>
      }
    </div>
  )
}

function DropMenu({ userId, sessionLive, connectToSocket, history, boardId }) {

  return (
    <div className="dropMenuContainer row">
      {sessionLive && userId

        ? <div id="sessionIdBox">
            <div className="noselect">
              Share Session Link:
            </div>  
            <div className="col-12">
              {`${window.location.host}/gameboard/${boardId}`}
            </div>
            
          </div>
        : null
      }
      <div className="dropTile rightSide col-12">
        <button className="noselect tile dropButton" onClick={() => history.goBack()}>
          {userId ? 'Dashboard' : 'Home'}
        </button>
        {userId
          ? <button onClick={connectToSocket} className={` noselect tile dropButtonSession`}>
              {sessionLive ? 'End Session' : 'Start Session'}
            </button> 
          : null
        }
   
      </div>


    </div>
  )

}

function DropDownNav({ sessionLive, history, connectToSocket, boardId }) {
  const [visibility, setVisibility] = useState(false)
  const boxRef = useRef();
  const auth = useAuth();
  const authCheck = auth.userId ? auth.userId : null;

  const checkForClick = (event) => {
    if(event.target === boxRef.current) {
      setVisibility(!visibility)
    }
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
    <div ref={boxRef} onClick={checkForClick} className={`${sessionLive ? 'activeBurger' : ''} ${visibility ? 'openMenu' : ''}`} id="hamburger">
      <BsThreeDotsVertical className="hide" size="20px" />
      {visibility
        ? <DropMenu userId={authCheck} sessionLive={sessionLive} history={history} connectToSocket={connectToSocket} boardId={boardId} />
        : null
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
  const [guest, setGuest] = useState({
    id: '',
    username: ''
  })
  const auth = useAuth()
  const notify = useNotify()
  const boardId = props.match.params.id
  let history = useHistory();
  const location = useLocation();




  const connectToSocket = async () => {
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
      setSessionLive(true)
    } else {
      socketServices.dmDisconnecting();
      setSessionLive(false);
    }

  }

  const updateIcon = async(position, id) => {
    socketServices.moveIcon(position, id)
    await iconService.updateIcon(position, id)
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
    if (location.state) {
      setGuest({
        id: location.state.id,
        username: location.state.username
      })
    }
  }, [])

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
      if(!location.state) {
        await socketServices
          .initiateGuestSocket(boardId, history, loadGameBoard, ()=>{
            let guestName = sessionStorage.getItem('guestUserName') || "$"
            while (/(\$|{|}|\/|\\|\*|\(|\)\`)+/g.test(guestName)) {
              guestName = window.prompt('Please input a player name, no special characters permitted') || 'User'
            }
            setGuest({...guest, username: guestName })
            return guestName
          })

      } else {
        socketServices.initiateGuestSocket(boardId, history, loadGameBoard)
      }
    }

    if(auth.userId || window.localStorage.getItem('loggedDungeonMaster')) {
      loadGameBoard();
    } else {
      guestAuthorization();
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
      <DropDownNav sessionLive={sessionLive} history={history} connectToSocket={connectToSocket} boardId={boardId} />
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

