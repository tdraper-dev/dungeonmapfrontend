import React, { useCallback } from 'react'
import Draggable from './DragComponent'
import iconService from '../services/icon'
import icon from '../services/icon';

function debounce(func, timeout = 1000) {
  let timer;
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => { func.apply(this, args); }, timeout)
  }
}



function Icon({ style, content, id, position, display=false }) {
  
  const updateIcon = useCallback(
    debounce(async(position) => {
      const updatedIcon = await iconService.updateIcon(position, id)
    }, 1000),
    []
  )

  const deleteIcon = async(iconId) => {
    console.log('DELETE THIS ICON ID ', iconId)
    const response = await iconService.deleteIcon(iconId)
  }

  return (
    <>
    {display
      ? <div className="draggableBox" style={{ top: position.y, left: position.x }}>
          <div style={style} className="noselect playerIcon">
            {content}
          </div>
        </div>
      : <Draggable 
          updatePosition={updateIcon} 
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