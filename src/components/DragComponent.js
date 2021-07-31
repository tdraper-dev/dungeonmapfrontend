import React, { useState, useEffect, useRef } from 'react';


function Draggable({ 
  children, 
  position, 
  updatePosition, 
  deleteIcon, 
  id
 }) {
  const [drop, setDrop] = useState({ x: position.x, y: position.y })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef()

  const handlePointerDown = (e) => {
    window.addEventListener('pointermove', handleDragMove);
    window.addEventListener('pointerup', handlePointerUp);

    e.stopPropagation();
    e.preventDefault();
  };

  /*const handlePointerMove = (e) => {
    if (dragging) handleDragMove(e) 
  } */
  
  const handleDragMove = (e) => {
      dragRef.current.style.left = `${dragRef.current.offsetLeft + e.movementX}px`
      dragRef.current.style.top = `${dragRef.current.offsetTop + e.movementY}px`

      e.stopPropagation();
      e.preventDefault();
  };

  const handlePointerUp = (e) => {

    const aspectBox = document.getElementById('aspectRatioBox')
    const bounding = dragRef.current.getBoundingClientRect();

    if(bounding.x < 100 && bounding.y < 100) {
      try {
        deleteIcon(id)
      } catch(exception) {
        console.log('Unable to delete icon', exception)
      }
    } else if (drop.x !== dragRef.current.style.left && drop.y !== dragRef.current.style.top) {
      setDrop({
        x: `${dragRef.current.style.left.replace(/px/g, '')/aspectBox.clientWidth*100}%`,
        y: `${dragRef.current.style.top.replace(/px/g, '')/aspectBox.clientHeight*100}%`
      })
    }
    window.removeEventListener('pointermove', handleDragMove);
    window.removeEventListener('pointerup', handlePointerUp);

    e.stopPropagation();
    e.preventDefault();
  }



  const preventBehavior =(e) => {
    e.preventDefault();
  }

  useEffect(() => {
    window.addEventListener('touchmove', preventBehavior, {passive: false})

    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('touchmove', preventBehavior, {passive: false})
      window.removeEventListener('pointermove', handleDragMove);
      window.removeEventListener('pointerup', handlePointerUp);
    } 

  }, [])


  const firstRender = useRef(true);
  useEffect(() => {
    if(!firstRender.current) {
      updatePosition({ 
        x: drop.x, 
        y: drop.y 
      }, id)
    }
  }, [drop.x, drop.y] ) 

  useEffect(() => { firstRender.current = false }, [])
  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerOut={null}
      style={{top: position.y, left: position.x}}
      className="draggableBox"
      ref={dragRef}
    >
      {children}
    </div>

  )
}

export default Draggable