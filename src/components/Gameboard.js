import React, { useState, useRef, useEffect } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios'
import imageService from '../services/image'
import imageUtility from '../utils/imageHelper'

function MapImageView({ mapSrc }) {
  if(!mapSrc) {
    console.log('not loaded yet')
  }
  return (
    <div className="mapImageView col-8 my-4 d-flex">
      <div className="imageBox py-1 px-1 py-md-5 px-md-5 d-flex">
        <img className="mapImage img-fluid" alt='' src={mapSrc} />
      </div>

    </div> 
  )
}

function GreySquare() {
  return (
    <div className="greySquare"> LOADING! </div>
  )
}

function MapTray({ mapSrc }) {

  return (
    <div className="mapTrayContainer col-12   d-flex">
      {mapSrc
        ? <MapImageView mapSrc={mapSrc} />
        : <GreySquare />
      }
    </div>
  )
}

function Gameboard(props) {
  const [image64, setImage64] = useState('')
  const boardId = props.match.params.id
  
  useEffect(() => {
    const source = axios.CancelToken.source()
    const loadMapImage = async() => {
      try {
        const buffer = await imageService.retrieveMapImage(boardId, source.token)
        if(buffer) {
          imageUtility.convertBuffertoBlob(buffer)
            .then(response => setImage64(response))
        }
      } catch (exception) {
        console.log(exception)
      }
    }
    loadMapImage()
    return () => {source.cancel()}
  }, [])

  return (
    <div className="gameBoardPage row">
      <MapTray mapSrc={image64} />
    
      <FileBase64 className="" boardId={boardId}
      multiple={false}
      onDone={({ base64 }) => setImage64(base64)} />
    </div>
  )
}


function FileBase64(props) {

  const handleChange = async (e) => {
    e.preventDefault()

    let file = fileRef.current.files[0]
    const buffer = await imageService.saveMapImage(file, props.boardId);
    imageUtility.convertBuffertoBlob(buffer).then( response => props.onDone({ base64: response }) )
  }

  const fileRef = useRef()
  return (
    <form id="uploadForm" encType='multipart/form-data' onSubmit={handleChange}>

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

