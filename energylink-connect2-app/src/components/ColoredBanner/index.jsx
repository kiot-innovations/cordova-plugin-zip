import React from 'react'
import { isEmpty } from 'ramda'
import clsx from 'clsx'
import './ColoredBanner.scss'
import { either } from 'shared/utils'

export const bannerCategories = {
  WARNING: { color: 'banner-warning', icon: 'sp-hey icon-warning' },
  SUCCESS: { color: 'banner-success', icon: 'sp-check icon-success' },
  ERROR: { color: 'banner-error', icon: 'sp-close icon-error' },
  INFO: { color: 'banner-info', icon: 'sp-info icon-info' }
}

function ColoredBanner({
  category = bannerCategories.INFO,
  text = 'Default banner text',
  actionText = '',
  action = () => {},
  className = ''
}) {
  return (
    <div className={clsx(['banner', category.color, className])}>
      <div className="banner-content">
        <div className="banner-content-icon mr-10 has-text-primary">
          <span className={clsx(['is-size-5', category.icon])} />
        </div>
        <div className="banner-content-text has-text-white">
          <span>{text}</span>
        </div>
      </div>
      {either(
        !isEmpty(actionText),
        <div
          onClick={action}
          className="banner-action is-uppercase has-text-primary has-text-centered mt-10"
          role="button"
        >
          <span>{actionText}</span>
        </div>
      )}
    </div>
  )
}

export default ColoredBanner
