import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import axios from 'axios'
import gameBoardService from '../services/gameboard'
import imageUtility from '../utils/imageHelper'
import LoadingSquare from './LoadingSquare'
import Icon from './Icon'
import MasterBuilderNav from './MasterBuilderBar.js'

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

function MapTray({ mapSrc, loading, icons, setIcons }) { 
  
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
    return () => {source.cancel()}
  }, [])
  console.log('initial icons', icons)
  return (
    <>
    <div className="gameBoardRow row">
      <div className="backBox d-flex">
          <button className="buttons" onClick={() => history.goBack()}>Return to Dashboard</button>
      </div>
      <MapTray mapSrc={image64} loading={loading} icons={icons} setIcons={setIcons} />
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

