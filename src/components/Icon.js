import React from 'react'
import Draggable from './DragComponent'

function Icon({ updatePosition, style, content, id, position }) {

  return (
    <Draggable position={position} key={id}>
      <div style={style} className="noselect playerIcon">
        {content}
      </div>
    </Draggable>
  )
}

export default Icon