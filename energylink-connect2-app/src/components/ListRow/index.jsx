import clsx from 'clsx'
import React from 'react'

import { useI18n } from 'shared/i18n'
import { createExternalLinkHandler } from 'shared/routing'
import './ListRow.scss'

function ListRow({ title = 'title', link = '' }) {
  const t = useI18n()

  return (
    <div
      className="row"
      onClick={link ? createExternalLinkHandler(link) : null}
    >
      <div className="row-header">
        <div className="row-title">
          <span className="has-text-weight-bold">{t(title)}</span>
        </div>
        <div className="row-trigger">
          <div className={clsx({ download: true })}>
            <span className="sp-download is-size-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListRow
