import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from "react-router-dom"
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

  return (
    <div className="mapTrayContainer col-12   d-flex">
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
                /> 
            })}
            <img draggable="false" className="noselect mapImage img-fluid" alt='' src={mapSrc} />
          </MapImageView>
      }
    </div>
  )
}

function BuildIcon({ createIcon, boardId }) {
  const [content, setContent] = useState('')
  const [color, setColor] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(content, ',', color, ',', boardId)
    createIcon({
      content,
      color,
      boardId
    })
  }
 
  return (
    <div className="buildIconFormBox">
      <form onSubmit={handleSubmit}>
        <label htmlFor='iconContentInput'>Content: </label>
        <input
          id="iconContentInput"
          type='text'
          value={content}
          onChange={({ target }) => setContent(target.value) }
          required
        />
        <label htmlFor='iconColorInput'>Color: </label>
        <input
          id="iconColorInput"
          type='text'
          value={color}
          onChange={({ target }) => setColor(target.value) }
        />
        <button className="ms-2" type="submit">Create Icon</button>
      </form>
    </div>
  )
}

function FileBase64({setLoading, boardId, setImage64, onDone, image64 }) {

  const handleChange = async (e) => {
    const currentMap = image64; 
    e.preventDefault()
    setLoading(true)
    let file = fileRef.current.files[0]
    const buffer = await gameBoardService.updateGameBoardImage(file, boardId);
    const mapImage = await imageUtility.convertBuffertoBlob(buffer.data)
    await setImage64(mapImage)
    setLoading(false)
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


function Gameboard(props) {
  const [image64, setImage64] = useState('')
  const [icons, setIcons] = useState([])
  const [loading, setLoading] = useState(true)
  const boardId = props.match.params.id
  let history = useHistory()

  const createIcon = async (iconInfo) => {
    const newIcon = await iconService.createIcon(iconInfo)
    setIcons(icons.concat(newIcon))
  }
  
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
  return (
    <>
    <div className="navBox row">
        <FileBase64 
          setLoading={setLoading} 
          boardId={boardId} 
          setImage64={setImage64}
          image64={image64}
          />
        <div className="backBox d-flex col-2">
          <button onClick={() => history.goBack()}>Back</button>
        </div>
        <BuildIcon createIcon={createIcon} boardId={boardId} />
    </div>
    <div className="gameBoardRow row">

      <MapTray mapSrc={image64} loading={loading} icons={icons} setIcons={setIcons} />
    </div>
    </>
  )
}



export default Gameboard

