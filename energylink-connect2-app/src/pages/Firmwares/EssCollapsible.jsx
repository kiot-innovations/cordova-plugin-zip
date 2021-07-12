import { prop } from 'ramda'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Collapsible from 'components/Collapsible'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { DOWNLOAD_OS_INIT } from 'state/actions/ess'

const EssFirmwareStatus = ({ isDownloading, progress, step }) => {
  const t = useI18n()
  return (
    <div>
      {either(
        isDownloading,
        <div>
          <span className="has-text-white has-text-weight-bold mr-10">
            {progress}%
          </span>
          <span>{t(step)}</span>
        </div>,
        <>
          <span className="has-text-white has-text-weight-bold mr-10">
            100%
          </span>
          <span>{t('DOWNLOADED')}</span>
        </>
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
