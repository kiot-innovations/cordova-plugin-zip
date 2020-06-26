import React from 'react'
import './banner.scss'

const Banner = () => {
  if (process.env.REACT_APP_IS_TEST)
    return <div className="development-banner">TEST</div>
  if (process.env.REACT_APP_IS_DEV)
    return <div className="development-banner">DEV</div>
  return null
}

export default Banner
