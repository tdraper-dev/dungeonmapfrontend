import React, { useState, useEffect, useRef } from 'react';
import iconServices from '../services/icon'

function Draggable({ children, isSvg = false, position, updatePosition, deleteIcon, id }) {
  const [dragging, setDragging] = useState(false)
  const [drop, setDrop] = useState({ x: position.x, y: position.y })
  const dragRef = useRef()

  const handleDragMove = (e) => {
    console.log('e.movementX', e.movementX)
    const aspectBox = document.getElementById('aspectRatioBox')
    dragRef.current.style.left = `${((dragRef.current.offsetLeft + e.movementX)/aspectBox.clientWidth)*100}%`
    dragRef.current.style.top = `${((dragRef.current.offsetTop + e.movementY)/aspectBox.clientHeight)*100}%`
  };

  const handlePointerDown = (e) => {
    setDragging(true);
  }

  const handlePointerUp = (e) => {
    const bounding = dragRef.current.getBoundingClientRect();
    setDragging(false);
    if(bounding.x < 100 && bounding.y < 100) {
      try {
        deleteIcon(id)
        dragRef.current.remove()
      } catch(exception) {
        console.log('Unable to delete icon', exception)
      }
    } else if (drop.x !== dragRef.current.style.left && drop.y !== dragRef.current.style.top) {
      setDrop({
        x: dragRef.current.style.left,
        y: dragRef.current.style.top
      })
    }
  }

  const handlePointerMove = (e) => {
    if (dragging) handleDragMove(e) 
  }

  const preventBehavior =(e) => {
    e.preventDefault();
  }

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('touchmove', preventBehavior, {passive: false})

    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('touchmove', preventBehavior, {passive: false})
    } 

  }, [])

  const firstRender = useRef(true);
  useEffect(() => {
    if(!firstRender.current) {
      updatePosition({ 
        x: drop.x, 
        y: drop.y 
      })
      //THIS IS WHERE WE DO A SOCKET.IO EMISSION AND PUSH TO SERVER
    }
  }, [drop.x, drop.y] ) 
  
  useEffect(() => { firstRender.current = false }, [])
  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      handlePointerUp={handlePointerUp}
      style={{top: position.y, left: position.x}}
      className="draggableBox"
      ref={dragRef}
    >
      {children}
    </div>

  )
}

export default Draggable