import React from 'react'


function AddContentCircle({ color }) {
  return (
    <div style={{'backgroundColor': `${color}`}} className="AddContentCircle"> 
      <div className="AddContentCircleText d-flex">
        Add content
      </div> 
    </div>
  )
}

export default AddContentCircle