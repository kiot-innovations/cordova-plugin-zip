import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Logo from '@sunpower/sunpowerimage'
import { either } from 'shared/utils'
import { Loader } from 'components/Loader'
import { SET_MAP_VIEW_SRC } from 'state/actions/site'
import './ProgressiveImage.scss'

const ProgressiveImage = ({ src, animationState }) => {
  const dispatch = useDispatch()
  const { mapViewSrc } = useSelector(state => state.site)
  useEffect(() => {
    if (animationState === 'enter' && !mapViewSrc !== src) {
      const i = new Image()
      i.onload = function() {
        dispatch(SET_MAP_VIEW_SRC(src))
      }
      i.src = src
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="ic is-flex">
      {either(
        mapViewSrc,
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
