import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Draggable({ children, isSvg = false, position, updatePosition }) {
  const [dragging, setDragging] = useState(false)
  const [drop, setDrop] = useState({ x: 0, y: 0 })
  const dragRef = useRef()

  const handleDragMove = (e) => {
    const aspectBox = document.getElementById('aspectRatioBox')
    dragRef.current.style.left = `${((dragRef.current.offsetLeft + e.movementX)/aspectBox.clientWidth)*100}%`
    dragRef.current.style.top = `${((dragRef.current.offsetTop + e.movementY)/aspectBox.clientHeight)*100}%`
  };

  const handlePointerDown = (e) => {
    setDragging(true);
  }

  const handlePointerUp = (e) => {
    setDragging(false);

    setDrop({
      x: dragRef.current.style.left,
      y: dragRef.current.style.top
    })
  }

  const handlePointerMove = (e) => {
    e.preventDefault();
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
  }, [drop, updatePosition] ) 
  
  useEffect(() => { firstRender.current = false }, [])
  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={{top: position.y, left: position.x}}
      className="draggableBox"
      ref={dragRef}
    >
      {children}
    </div>

  )
}

export default Draggable