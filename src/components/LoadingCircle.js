import React from 'react'


function LoadingCircle({ color }) {
  return (
    <div style={{'backgroundColor': `${color}`}} className="loadingCircle"> 
      <div className="loadingText d-flex">
        Add content
      </div> 
    </div>
  )
}

export default LoadingCircle