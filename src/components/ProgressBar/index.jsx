import React from 'react'
import './ProgressBar.scss'

export const SIZES = {
  SMALL: 'is-small',
  MEDIUM: 'is-medium',
  LARGE: 'is-large'
}

function ProgressBar({ value = 0, indeterminate = false, size = SIZES.SMALL }) {
  const valueProp = indeterminate ? {} : { value }
  return (
    <progress
      className={'progress is-primary ' + size}
      {...valueProp}
      max="100"
    ></progress>
  )
}

export default ProgressBar
