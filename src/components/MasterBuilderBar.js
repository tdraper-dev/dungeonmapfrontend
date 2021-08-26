import React, { useState, useRef } from 'react'
import gameBoardService from '../services/gameboard'
import imageUtility from '../utils/imageHelper'
import iconService from '../services/icon'
import socketServices from '../services/socketManager'
import { useNotify } from '../services/use-notification'
import { NotificationError } from './Notification'
import imageHelper from '../utils/imageHelper'

function BuildIcon({ createIcon, boardId, visible }) {
  const [content, setContent] = useState('')
  const [color, setColor] = useState('rgba(250,235,215,1)')

  const handleSubmit = async(e) => {
    e.preventDefault()
    await createIcon({
      content,
      color,
      boardId
    })
    setContent('')
    document.getElementById('iconContentInput').blur()
  }

  const raiseTheBar = ({ target }) => {
    if(window.innerWidth < 420) {
      target.style.transform = "translateY(-460%)"
    }
    target.setAttribute('autocomplete', 'off');
  } 

  const lowerTheBar = ({ target }) => {
    target.style.transform = 'translateY(0%)'
  }
 
  return (
    <div className={`${visible ? 'visibleTool ' : ''}buildIconFormBox`}>
      <form onSubmit={handleSubmit} className="changeMapRow row mt-3">

        <label className="col-4 mb-1" htmlFor='iconContentInput'>Content: </label>
        <input
          id="iconContentInput"
          type='text'
          value={content}
          onChange={({ target }) => setContent(target.value) }
          onFocus={raiseTheBar}
          onBlur={lowerTheBar}
          required
          className="col-8"
          autoComplete="new-password"
        />
        <label className="col-4 my-1" htmlFor='iconColorInput'>Color: </label>
        <select 
          className="col-4" 
          name="colors" 
          id="iconColorInput" 
          onChange={({ target }) => setColor(target.value)} 
        >
          <option 
            value="rgba(250,235,215,1)"
            defaultValue
            >White</option>
          <option 
            style={{backgroundColor: 'rgba(191, 63, 63, 1)'}} 
            value="rgba(191, 63, 63, 1)"
            >Red</option>
          <option 
            style={{backgroundColor: 'rgba(63,127,191,1'}} 
            value="rgba(63,127,191,1)"
            >Blue</option>
          <option 
            style={{backgroundColor: 'rgba(63,191,63,1)'}} 
            value="rgba(63,191,63,1)"
            >Green</option>
        </select>
        {content && color
          ?
            <div 
              style={{ backgroundColor: color }}className=" playerIcon playerIconPreview my-3">
              {content}
            </div>
          : null
        }
        <button className='cake ms-2 mt-3 col-6 submitButtonFix' type="submit">Create Icon</button>
    
      </form>
      <NotificationError style={{left: '50px', bottom: '50px', top: 'unset'}}errorType='iconContent' />
    </div>
  )
}

function BuildMap({setLoading, boardId, setImage64, visible }) {
  const [imagePreview, setImagePreview] = useState('')
  const regTest = /image\/(png|jpeg)/
  const notify = useNotify()

  const preview = async() => {
    const file = fileRef.current.files[0]
    setImagePreview('')
    try {
      const newImage = await imageHelper.thumbnailPreviewBuilder(file)
      setImagePreview(newImage)
    } catch(error) {
      notify.notify({
        notification: error.notification,
        errorType: error.errorType
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let file = fileRef.current.files[0] || null
    if(regTest.test(file.type)) {
      try {
        setLoading(true)
        const buffer = await gameBoardService.updateGameBoardImage(file, boardId);
        const mapImage = await imageUtility.convertBuffertoBlob(buffer.data)
        if(mapImage) {
          socketServices.changeMap()
        }
        await setImage64(mapImage)
        setImagePreview('')
        setLoading(false)
      } catch(exception) {
        setLoading(false)
        notify.notify({
          notification: exception.response.data.error,
          errorType: 'mapImage'
        })
      }
    } else {
      notify.notify({
        notification: 'Unsupported file format',
        errorType: 'mapImage'
      })
    }
  
  }


  const fileRef = useRef()
  return (
    <form id="uploadForm" className={`mt-5 ${visible ? 'visibleTool ' : ''}`} encType='multipart/form-data' onSubmit={handleSubmit}>
      <div className="mapFormButtons">
      <label htmlFor="fileUpload" className='fileUpload px-2 mx-2' >Select Image</label>

      <input 
        ref={fileRef} 
        type="file" 
        id="fileUpload" 
        name="file"
        onChange={preview} 
        required />

      <input type='submit' value='Upload' />
      </div>
      <div className="imagePreviewBox mt-5">
        {imagePreview
          ? <img alt="Thumbnail preview of map" src={imagePreview} className="imagePreview toolBar" />
          : null
        }
      </div>
      <NotificationError style={{left: '50px', top: '150px'}} errorType='mapImage' />
    </form>
  )
}





function MasterBuilder({
  icons,
  setIcons,
  setImage64,
  setLoading,
  boardId,
  float,
  setFloat
}) {
  const [option, setOption] = useState('')
  const[navBarVis, setNavBarVis] = useState(true)
  const notify = useNotify()

  const createIcon = async (iconInfo) => {
    try {
      const newIcon = await iconService.createIcon(iconInfo)
      socketServices.createIcon(newIcon)
      setIcons(icons.concat(newIcon))
    } catch(exception) {
      notify.notify({
        notification: 'Not accepted characters: $, }, {, /, \\, *, ), (, ` ',
        errorType: 'iconContent'
      })
    }

  }

  const toggleMovement = () => {
    setNavBarVis(!navBarVis)
    setFloat(!float)
  }

  let box = null;

  if(option === 'changeMap') {
    box = <BuildMap setLoading={setLoading} boardId={boardId} setImage64={setImage64}/>
  } else if (option === 'buildIcon') {
    box = <BuildIcon createIcon={createIcon} boardId={boardId}/>
  }


  return (
    <div id="dungeonMasterSideBar" aria-label="sidebar" aria-hidden={navBarVis}className="sidebar row">
      <div onClick={toggleMovement} className=" dmArmBox buttonArmBox">
        <div className="noselect toggleClickBox dmClickBox">Tools</div>
      </div>
      <div className="toolBarRow row">
        <div className="toolButtonBar col-12 ps-0 pe-0">
          <button onClick={()=> setOption('changeMap')} 
            className="changeMap">Change Map</button>
          <button onClick={()=> setOption('buildIcon')} 
            className="addIcon">Add Icon</button>
        </div>
        </div>
        <div className="row">
          {box}
        </div>
    </div>
  )
}

export default MasterBuilder