import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import axios from 'axios'
import gameBoardService from '../services/gameboard'
import imageUtility from '../utils/imageHelper'
import LoadingSquare from './LoadingSquare'
import Icon from './Icon'
import MasterBuilderNav from './MasterBuilderBar.js'
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

function MapTray({ mapSrc, loading, icons, setIcons, deleteIcon }) { 
  
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
  const [loading, setLoading] = useState(true)
  const [sessionLive, setSessionLive] = useState(false)
  const auth = useAuth()
  const boardId = props.match.params.id
  let history = useHistory();


  useEffect(() => {
    const source = axios.CancelToken.source()
    setLoading(true)

    const loadGameBoard = async() => {
      try {
        const gameBoard = await gameBoardService.getGameBoard(boardId, source.token)
        const boardImage = await imageUtility.convertBuffertoBlob(gameBoard.image.data)
        setImage64(boardImage)
        setIcons(gameBoard.icons)
        setLoading(false)
      } catch (exception) {
        console.log('loading mapImage failed', exception)
      }
    }
    loadGameBoard()
    return () => {
      source.cancel()
      socketServices.disconnectSocket()
    }
  }, [])


  const connectToSocket = () => {
    if(sessionLive === false) {
      socketServices.initiateSocket(boardId)

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
      socketServices.disconnectSocket()
      setSessionLive(false)
    }

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
          <button className="buttons" onClick={() => history.goBack()}>Return to Dashboard</button>
      </div>
      <div className="sessionButtonBox d-flex">
          <button onClick={connectToSocket} className="buttons">
            {sessionLive ? 'End Session' : 'Start Session'}
            </button>
      </div>
      <MapTray deleteIcon={deleteIcon}  mapSrc={image64} loading={loading} icons={icons} setIcons={setIcons} />
    </div>
    <MasterBuilderNav
      setLoading={setLoading}
      boardId={boardId}
      setImage64={setImage64}
      icons={icons}
      setIcons={setIcons}
    />
    </>
  )
}


export default Gameboard

