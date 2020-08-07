import React from 'react'
import { compose, join, prop, propOr, split } from 'ramda'

import { either } from 'shared/utils'
import Collapsible from 'components/Collapsible'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { DOWNLOAD_OS_INIT } from 'state/actions/ess'

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

function EssCollapsible() {
  const essState = useSelector(prop('ess'))
  const dispatch = useDispatch()
  const t = useI18n()

  return (
    <Collapsible
      title={'STORAGE_FW_FILE'}
      expanded
      actions={
        !essState.isDownloading && (
          <span
            className="is-size-4 sp-download"
            onClick={() => dispatch(DOWNLOAD_OS_INIT(true))}
          />
        )
      }
    >
      {either(
        essState.error,
        <span>{t('ERROR_DOWNLOADING_ESS')}</span>,
        <section className="mt-20 mb-20">
          <p className="mb-5">
            <EssFirmwareStatus {...essState} />
          </p>
          {essState.isDownloading && (
            <progress
              className="progress is-tiny is-white"
              value={essState.progress}
              max="100"
            />
          )}
        </section>
      )}
    </Collapsible>
  )
}

export default EssCollapsible
