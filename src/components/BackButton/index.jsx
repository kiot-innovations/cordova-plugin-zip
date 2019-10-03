import React from 'react'
import clsx from 'clsx'
import { BackArrow } from './Icons'

function goBack(history, to) {
  return () =>
    to
      ? history.push({ pathname: to, state: history.location.state })
      : history.goBack()
}

function BackButton({
  history,
  to,
  width = '17',
  height = '12',
  classNames = ''
}) {
  return (
    <BackArrow
      className={clsx('back-button', classNames)}
      onClick={goBack(history, to)}
      width={width}
      height={height}
    />
  )
}

export default BackButton
