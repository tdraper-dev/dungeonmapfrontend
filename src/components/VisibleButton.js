import React, { useState } from 'react'

function VisibleButton (props) {
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  return (
    <div className={props.className}>
      <button onClick={toggleVisible} className="buttons signUpButton">{props.label}</button>
      { visible ? React.cloneElement(props.children, { ...props, setVisible: setVisible })
        : null
      }
      
    </div>
  )
}

export default VisibleButton