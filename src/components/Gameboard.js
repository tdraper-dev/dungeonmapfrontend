import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from "react-router-dom"
import Dashboard from './Dashboard'
import axios from 'axios'
import imageService from '../services/image'
import imageUtility from '../utils/imageHelper'
import LoadingSquare from './LoadingSquare'

function MapImageView(props) {
  
  return (
    <div className="mapImageView col-8 my-4 d-flex">
      <div className="imageBox py-1 px-1 py-md-5 px-md-5 d-flex">
        {props.children}
      </div>

    </div> 
  )
}

function MapTray({ mapSrc, loading }) {

  return (
    <div className="mapTrayContainer col-12   d-flex">
      {loading
        ? <LoadingSquare />
        : <MapImageView>
            <img className="mapImage img-fluid" alt='' src={mapSrc} />
          </MapImageView>
      }
    </div>
  )
}

function Gameboard(props) {
  const [image64, setImage64] = useState('')
  const boardId = props.match.params.id
  const [loading, setLoading] = useState(true)
  let history = useHistory()
  
  useEffect(() => {
    const source = axios.CancelToken.source()
    setLoading(true)
    const loadMapImage = async() => {
      try {
        const buffer = await imageService.retrieveMapImage(boardId, source.token)
        if(buffer) {
          imageUtility.convertBuffertoBlob(buffer)
            .then(response => {
              setImage64(response)
              setLoading(false)
            })
        }
      } catch (exception) {
        console.log(exception)
      }
    }
    loadMapImage()
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

      <MapTray mapSrc={image64} loading={loading} />
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

