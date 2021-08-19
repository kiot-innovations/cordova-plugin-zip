import clsx from 'clsx'
import React from 'react'
import { useHistory } from 'react-router-dom'

import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'

const Template = ({ children, className = '' }) => {
  const history = useHistory()
  const t = useI18n()
  const backToDevices = () => {
    history.push(paths.PROTECTED.RMA_DEVICES.path)
  }
  return (
    <div
      className={clsx(
        'fill-parent is-flex tile is-vertical has-text-centered pl-10 pr-10 mb-40 string-inverters is-relative',
        className
      )}
    >
      <div className="header mb-20">
        <span
          className="sp-chevron-left has-text-primary is-size-4 go-back"
          onClick={backToDevices}
        />
        <span className="is-uppercase has-text-weight-bold page-title">
          {t('OTHER_DEVICES')}
        </span>
      </div>
      <div className="full-height">{children}</div>
    </div>
  )
}
export default Template
