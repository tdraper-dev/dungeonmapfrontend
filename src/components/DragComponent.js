import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function Draggable({ children, isSvg = false, position }) {
  const [dragging, setDragging] = useState(false)
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });
  const [drop, setDrop] = useState({
    x: 0,
    y: 0
  })
  const dragRef = useRef()

  const onPointerDown = (e) => {

    setTranslate({
      x: e.clientX,
      y: e.clientY
    })
  }

  const handleDragMove = (e) => {
    let newposX = translate.x - e.clientX
    let newposY = translate.y - e.clientY

    setTranslate({
      x: e.clientX,
      y: e.clientY
    })

    const aspectBox = document.getElementById('aspectRatioBox')

    dragRef.current.style.left = `${((dragRef.current.offsetLeft - newposX)/aspectBox.clientWidth)*100}%`
    dragRef.current.style.top = `${((dragRef.current.offsetTop - newposY)/aspectBox.clientHeight)*100}%`
  };

  const handlePointerDown = (e) => {
    setDragging(true);
    onPointerDown(e)
  }

  const handlePointerUp = (e) => {
    setDragging(false);
    e.stopPropagation()
    e.preventDefault()
    setDrop({
      x: dragRef.current.style.left,
      y: dragRef.current.style.top
    })
  }

  const handlePointerMove = (e) => {
    if (dragging) handleDragMove(e) 
  }


  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  useEffect(() => {
    console.log('YOU DROPPED THE ICON!')
    //THIS IS WHERE WE DO A SOCKET.IO EMISSION AND PUSH TO SERVER

  }, [drop.x, drop.y])  

  const Tag = isSvg ? 'g' : 'div';
  return (
    <Tag
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={{top: position.y, left: position.x}}
      className="draggableBox"
      ref={dragRef}
    >
      {children}
    </Tag>

  )
}

export default Draggable