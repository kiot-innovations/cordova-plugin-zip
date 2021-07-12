import clsx from 'clsx'
import { includes } from 'ramda'
import React from 'react'

import { either } from 'shared/utils'
import './UpdateFirmwareStage.scss'

function UpdateFirmwareStage({
  stage,
  percent,
  children = '',
  waiting = false
}) {
  return (
    <div
      className={clsx('update-firmware-step', {
        'has-text-white': percent === 100
      })}
    >
      <span className="mr-10 is-capitalized has-text-weight-bold">{stage}</span>
      {either(
        includes(percent, [0, 100]),
        <span
          className={clsx('is-pulled-right  is-size-4 mr-10', {
            'sp-check has-text-white': percent === 100,
            'loader has-text-white': percent === 0 && waiting
          })}
        />,
        <span className="is-pulled-right has-text-white has-text-weight-bold">
          {percent} %
        </span>
      )}
      {children}
    </div>
  )
}

export default UpdateFirmwareStage
