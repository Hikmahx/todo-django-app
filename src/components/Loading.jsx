import React from 'react'
import loading from './loading.gif'

const Loading = () => {
  return (
    <div className="loading-container relative top-60 sm:top-40 lg:top-32 left-0 right-0 flex items-center justify-center w-16 h-16 mx-auto">
      <img style={{width:'4rem', height:'4rem'}} className="w-full h-full" src={loading} alt="loading"/>
    </div>
  )
}

export default Loading

