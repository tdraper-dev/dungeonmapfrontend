import React, { useState, useRef, useEffect } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios'
import imageService from '../services/image'
import imageUtility from '../utils/imageHelper'
import LoadingCircle from './LoadingCircle'

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
        ? <LoadingCircle color={'rgba(0, 230, 64, 1)'}/>
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
  
  useEffect(() => {
    const source = axios.CancelToken.source()
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

  console.log('loading', loading)
  return (
    <div className="gameBoardPage row">
      <MapTray mapSrc={image64} loading={loading} />
      <FileBase64 setLoading={setLoading} boardId={boardId}
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
    imageUtility.convertBuffertoBlob(buffer)
      .then( response => {
        props.setLoading(false)
        props.onDone({ base64: response }) 
      })
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

