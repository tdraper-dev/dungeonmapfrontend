import React, { useState, useEffect, useRef } from 'react';
import iconServices from '../services/icon'

function Draggable({ children, isSvg = false, position, updatePosition, deleteIcon, id }) {
  const [dragging, setDragging] = useState(false)
  const [drop, setDrop] = useState({ x: position.x, y: position.y })
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  })
  const dragRef = useRef()

  const handleDragMove = (e) => {
    //const aspectBox = document.getElementById('aspectRatioBox')
    //dragRef.current.style.transform = `translateX(${translate.x + e.movementX}px) translateY(${translate.y + e.movementY}px)`
    //console.log('dragRef', dragRef.current.style.transform)
    console.log(e.movementX)
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY
    })
    //dragRef.current.style.left = `${((dragRef.current.offsetLeft + e.movementX)/aspectBox.clientWidth)*100}%`
    //dragRef.current.style.top = `${((dragRef.current.offsetTop + e.movementY)/aspectBox.clientHeight)*100}%`
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
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', preventBehavior, {passive: false})

    return () => {
      window.removeEventListener('mouseup', handlePointerUp)
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
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      style={{
        transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
      }}
      className="draggableBox"
      ref={dragRef}
    >
      {children}
    </div>

  )
}

export default Draggable