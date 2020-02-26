import React, { useState } from 'react'
import clsx from 'clsx'
import * as PropTypes from 'prop-types'
import './ProgressiveImage.scss'

const ProgressiveImage = ({ overlaySrc, src, className = '', ...rest }) => {
  const [HighResLoaded, setHighResLoaded] = useState(false)
  return (
    <div className="progressive-image-container">
      <img
        onLoad={() => setHighResLoaded(true)}
        src={src}
        {...rest}
        alt=""
        className={clsx({ waiting: !HighResLoaded }, className)}
      />
      <img
        className={clsx(className, 'overlay', { hidden: HighResLoaded })}
        src={overlaySrc}
        alt=""
      />
    </div>
  )
}
ProgressiveImage.propTypes = {
  overlaySrc: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired
}
export default ProgressiveImage
