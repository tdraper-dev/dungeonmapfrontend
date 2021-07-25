import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Dashboard from './Dashboard'
import axios from 'axios'
import imageService from '../services/image'
import iconService from '../services/icon'
import gameBoardService from '../services/gameboard'
import imageUtility from '../utils/imageHelper'
import LoadingSquare from './LoadingSquare'
import Icon from './Icon'

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

  const createIcon = async (iconInfo) => {
    const newIcon = await iconService.createIcon(iconInfo)
    setIcons(icons.concat(newIcon))
  }

  return (
    <div className="mapTrayContainer col-12   d-flex">
      {loading
        ? <LoadingSquare />
        : <MapImageView>
            {icons.map(icon => {
              return <Icon 
                  updatePosition={'no'} 
                  style={{backgroundColor: icon.color, left: icon.position.x, top: icon.position.y}}
                  content={icon.content}
                  id={icon.id}
                  key={icon.id}
                  position={icon.position}
                /> 
            })}
            <img className="mapImage img-fluid noselect" alt='' src={mapSrc} />
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
  let history = useHistory()
  
  useEffect(() => {
    const source = axios.CancelToken.source()
    setLoading(true)

    const loadGameBoard = async() => {
      try {
        const gameBoard = await gameBoardService.getGameBoard(boardId, source.token)
        console.log('THIS IS YOUR GAMEBOARD', gameBoard)
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

  return (
    <>
    <div className="navBox row">
        <FileBase64 
          setLoading={setLoading} 
          boardId={boardId}
          setImage64={setImage64}
          multiple={false}
          onDone={({ base64 }) => setImage64(base64)} 
        />
        <div className="backBox d-flex col-2">
         <button onClick={() => history.goBack()}>Back</button>
        </div>
    </div>
    <div className="gameBoardRow row">

      <MapTray mapSrc={image64} loading={loading} icons={icons} setIcons={setIcons} />
    </div>
    </>
  )
}


function FileBase64(props) {

  const handleChange = async (e) => {
    e.preventDefault()

    let file = fileRef.current.files[0]
    const buffer = await imageService.saveMapImage(file, props.boardId);
    imageUtility.convertBuffertoBlob(buffer)
      .then( response => {
        props.setLoading(false)
        props.onDone({ base64: response }) 
      })
  }

  const fileRef = useRef()
  return (
    <form id="uploadForm" className="d-flex col-2" encType='multipart/form-data' onSubmit={handleChange}>

      <label htmlFor="fileUpload" className='fileUpload' >Upload Image</label>

      <input ref={fileRef} type="file" id="fileUpload" name="file" />

      <input type='submit' value='Upload' />

    </form>
  )

}

FileBase64.defaultProps = {
  multiple: false,
};

export default Gameboard

