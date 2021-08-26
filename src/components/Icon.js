import React from 'react'
import Draggable from './DragComponent'




function Icon({ 
  style, 
  content, 
  id, 
  position, 
  display=false, 
  deleteIcon,
  updatePosition }) {
  


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