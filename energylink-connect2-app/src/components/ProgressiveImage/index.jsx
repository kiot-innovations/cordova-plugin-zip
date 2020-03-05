import React, { useState, useEffect } from 'react'
import Logo from '@sunpower/sunpowerimage'
import { either } from 'shared/utils'
import { Loader } from 'components/Loader'
import './ProgressiveImage.scss'

const ProgressiveImage = ({ src }) => {
  const [isImageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const i = new Image()
    i.onload = function() {
      setImageLoaded(true)
    }
    i.src = src
  }, [src])

  return (
    <div className="ic is-flex">
      {either(
        isImageLoaded,
        <img src={src} alt="" />,
        <figure className="auto">
          <Logo />
          <Loader />
        </figure>
      )}
    </div>
  )
}

export default ProgressiveImage
