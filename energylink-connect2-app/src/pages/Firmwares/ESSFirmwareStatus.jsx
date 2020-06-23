import { compose, join, propOr, split } from 'ramda'
import React from 'react'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'

const parseName = compose(join(' '), split('-'), propOr('', 'name'))

const EssFirmwareStatus = ({ isDownloading, file, progress }) => {
  const t = useI18n()
  return (
    <div>
      {either(
        isDownloading,
        <div>
          <span className="has-text-white has-text-weight-bold mr-10">
            {progress}%
          </span>
          <span className="is-capitalized">{t('DOWNLOADING')}</span>
        </div>,
        <div>{parseName(file)}</div>
      )}
    </div>
  )
}

export default EssFirmwareStatus
