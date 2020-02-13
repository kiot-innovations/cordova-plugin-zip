import React from 'react'
import clsx from 'clsx'
import './Loader.scss'

export const Loader = ({ type = 'line-scale-pulse-out-rapid' }) => {
  const classList = clsx('loader-inner', type)

  return (
    <div className="custom-loader">
      <div className={classList}>
        <div /> <div /> <div /> <div /> <div />
      </div>
    </div>
  )
}
