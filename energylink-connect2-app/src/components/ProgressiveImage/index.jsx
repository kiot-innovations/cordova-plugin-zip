import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Logo from '@sunpower/sunpowerimage'
import { either } from 'shared/utils'
import { Loader } from 'components/Loader'
import { SET_MAP_VIEW_SRC } from 'state/actions/site'
import './ProgressiveImage.scss'

const ProgressiveImage = ({ src }) => {
  const dispatch = useDispatch()
  const { mapViewSrc } = useSelector(state => state.site)
  useEffect(() => {
    if (mapViewSrc !== src) {
      const i = new Image()
      i.onload = function() {
        dispatch(SET_MAP_VIEW_SRC(src))
      }
      i.src = src
    }
  }, [dispatch, mapViewSrc, src])

  return either(
    mapViewSrc,
    <img src={src} className="ici" alt="" />,
    <div className="ic is-flex">
      <figure className="auto">
        <Logo />
        <Loader />
      </figure>
    </div>
  )
}

export default ProgressiveImage
