import clsx from 'clsx'
import React from 'react'
import './Loader.scss'

export const Loader = ({ type = 'line-scale-pulse-out-rapid', outerClass }) => {
  const classList = clsx('loader-inner', type)
  const outerClasslist = clsx('custom-loader', outerClass)
  return (
    <div className={outerClasslist}>
      <div className={classList}>
        <div /> <div /> <div /> <div /> <div />
      </div>
    </div>
  )
}
