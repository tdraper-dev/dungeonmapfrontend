import React, { useState, useRef } from 'react'

function VisibleButton (props) {
  const [visible, setVisible] = useState(false)
  const makeContentRef = useRef()
  const toggleVisible = () => {
    setVisible(!visible)
  }

  return (
    <div className={props.className} style={props.style}>
      <button ref={makeContentRef} onClick={toggleVisible} className="buttons signUpButton">{props.label}</button>
      { visible ? React.cloneElement(props.children, { ...props, visible: visible, setVisible: setVisible })
        : null
      }
      
    </div>
  )
}

export default VisibleButton