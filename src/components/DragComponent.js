import React, { useState, useEffect, useRef } from 'react';

function Draggable({ 
  children, 
  position, 
  updatePosition, 
  deleteIcon, 
  id
 }) {
  const [drop, setDrop] = useState({ x: position.x, y: position.y })
  const dragRef = useRef()
  const posRef = useRef({
    x: 0,
    y: 0
  })

  const handlePointerDown = (e) => {

    const { left, top }  = dragRef.current.getBoundingClientRect()
    posRef.current = {
      x: left - e.clientX,
      y: top - e.clientY
    }

    window.addEventListener('pointermove', handleDragMove);
    window.addEventListener('pointerup', handlePointerUp);

    e.stopPropagation();
    e.preventDefault();
  };
  
  const handleDragMove = (e) => {
    const aspectBox = document.getElementById('aspectRatioBoxBoard').getBoundingClientRect()

    dragRef.current.style.left = `${(e.clientX + posRef.current.x - aspectBox.left)/aspectBox.width*100}%`
    dragRef.current.style.top = `${(e.clientY + posRef.current.y - aspectBox.top)/aspectBox.height*100}%`
 
    e.stopPropagation();
    e.preventDefault();
  };

  const handlePointerUp = (e) => {
    const bounding = dragRef.current.getBoundingClientRect();

    if(bounding.x < 85 && bounding.y < 85) {
      try {
        deleteIcon(id)
        dragRef.current.style.display = 'none';
      } catch(exception) {
        console.log('Unable to delete icon', exception)
      }
    } else if (drop.x !== dragRef.current.style.left && drop.y !== dragRef.current.style.top) {
      setDrop({
        x: dragRef.current.style.left,
        y: dragRef.current.style.top
      })
    }
    posRef.current = {
      x: 0,
      y: 0
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
    const icon = dragRef.current
    icon.addEventListener('touchmove', preventBehavior, {passive: false})

    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
      icon.removeEventListener('touchmove', preventBehavior, {passive: false})
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
      style={{top: position.y, left: position.x}}
      className="draggableBox"
      ref={dragRef}
    >
      {children}
    </div>

  )
}

export default Draggable