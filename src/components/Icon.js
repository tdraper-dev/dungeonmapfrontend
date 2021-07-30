import React, { useEffect, useCallback } from 'react'
import Draggable from './DragComponent'
import iconService from '../services/icon'
import socketServices from '../services/socketManager'

function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => { func.apply(this, args); }, timeout)
  }
}



function Icon({ 
  style, 
  content, 
  id, 
  position, 
  display=false, 
  deleteIcon,
  updatePosition }) {
  
/*
 const updateIcon = useCallback(
    debounce(async(position) => {
      socketServices.moveIcon(position, id)
      const updatedIcon = await iconService.updateIcon(position, id)
    }, 1000),
    []
  )
*/

  return (
    <>
    {display
      ? <div className="draggableBox" style={{ top: position.y, left: position.x }}>
          <div style={style} className="noselect playerIcon">
            {content}
          </div>
        </div>
      : <Draggable 
          updatePosition={updatePosition} 
          deleteIcon={deleteIcon} 
          position={position}
          id={id}
        >
          <div style={style} className="noselect playerIcon">
            {content}
          </div>
        </Draggable>
    }
    </>
  )
}

export default Icon