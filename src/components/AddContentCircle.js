import React from 'react'


function AddContentCircle({ color }) {
  return (
    <div style={{'backgroundColor': `${color}`}} className=" specialBounce AddContentCircle"> 
      <div className="noselect AddContentCircleText d-flex">
        Add content
      </div> 
    </div>
  )
}

export default AddContentCircle