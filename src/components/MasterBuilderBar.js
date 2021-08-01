import React, { useState, useRef, useEffect } from 'react'
import gameBoardService from '../services/gameboard'
import imageUtility from '../utils/imageHelper'
import iconService from '../services/icon'
import socketServices from '../services/socketManager'
import { BsFillSquareFill } from 'react-icons/bs'

function BuildIcon({ createIcon, boardId, visible }) {
  const [content, setContent] = useState('')
  const [color, setColor] = useState('rgba(250,250,250,1)')

  const handleSubmit = (e) => {
    e.preventDefault()
    createIcon({
      content,
      color,
      boardId
    })
    setContent('')
  }
  console.log('color', color)
  return (
    <div className={`${visible ? 'visibleTool ' : ''}buildIconFormBox`}>
      <form onSubmit={handleSubmit} className="changeMapRow row mt-5">

        <label className="col-4 mb-1" htmlFor='iconContentInput'>Content: </label>
        <input
          id="iconContentInput"
          type='text'
          value={content}
          onChange={({ target }) => setContent(target.value) }
          required
          className="col-8"
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
            selected
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
        <button className="ms-2 mt-3 col-6 submitButtonFix" type="submit">Create Icon</button>
      </form>
    </div>
  )
}
/*
<input
          id="iconColorInput"
          type='text'
          value={color}
          onChange={({ target }) => setColor(target.value) }
          className="col-8"
        />
        */
function FileBase64({setLoading, boardId, setImage64, visible }) {

  const handleChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    let file = fileRef.current.files[0]
    const buffer = await gameBoardService.updateGameBoardImage(file, boardId);
    const mapImage = await imageUtility.convertBuffertoBlob(buffer.data)
    if(mapImage) {
      socketServices.changeMap()
    }
    await setImage64(mapImage)

    setLoading(false)
  }

  const fileRef = useRef()
  return (
    <form id="uploadForm" className={`mt-5 ${visible ? 'visibleTool ' : ''}`} encType='multipart/form-data' onSubmit={handleChange}>

      <label htmlFor="fileUpload" className='fileUpload px-2 mx-2' >Select Image</label>

      <input ref={fileRef} type="file" id="fileUpload" name="file" required />

      <input type='submit' value='Upload' />

    </form>
  )
}





function MasterBuilder({
  icons,
  setIcons,
  setImage64,
  setLoading,
  boardId
}) {
  const [option, setOption] = useState('')
  const[navBarVis, setNavBarVis] = useState(true)

  const createIcon = async (iconInfo) => {
    const newIcon = await iconService.createIcon(iconInfo)
    socketServices.createIcon(newIcon)
    setIcons(icons.concat(newIcon))
  }

  let box = null;

  if(option === 'changeMap') {
    box = <FileBase64 setLoading={setLoading} boardId={boardId} setImage64={setImage64}/>
  } else if (option === 'buildIcon') {
    box = <BuildIcon createIcon={createIcon} boardId={boardId}/>
  }


  return (
    <div id="dungeonMasterSideBar" aria-label="sidebar" aria-hidden={navBarVis}className="sidebar row">
      <div onClick={() => setNavBarVis(!navBarVis)} className=" dmArmBox buttonArmBox">
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