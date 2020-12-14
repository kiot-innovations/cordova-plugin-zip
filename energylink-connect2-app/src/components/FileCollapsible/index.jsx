import clsx from 'clsx'
import moment from 'moment'
import React from 'react'
import { useI18n } from 'shared/i18n'
import Collapsible from 'components/Collapsible'
import { either } from 'shared/utils'
import { Link } from 'react-router-dom'
import './FileCollapsible.scss'

const FileCollapsible = ({
  progress = 0,
  error = null,
  fileName = '',
  isDownloading = false,
  isDownloaded = false,
  version = '',
  downloadFile,
  step = '',
  size = 10,
  goToReleaseNotes = null,
  lastTimeDownloaded = undefined
}) => {
  const t = useI18n()
  const showReleaseNotes = isDownloaded && goToReleaseNotes

  return (
    <Collapsible
      title={fileName}
      actions={either(
        !isDownloading,
        <span
          className={clsx('is-size-4 sp-color-sun', {
            'sp-download': !isDownloaded,
            'sp-update': isDownloaded
          })}
          onClick={downloadFile}
        />
      )}
      expanded
    >
      {either(
        error,
        <span>{t('FIRMWARE_ERROR_FOUND')}</span>,
        <>
          {either(
            version,
            <section className="mb-5">
              <span className="has-text-white">
                {either(
                  isDownloaded,
                  t('YOU_HAVE_THE_LATEST_FIRMWARE_VERSION', fileName, version),
                  <div className="mt-20">{`${t('VERSION')}: ${version}`}</div>
                )}
                {either(
                  !isDownloaded && !isDownloading,
                  <span className="has-text-white has-text-weight-bold">
                    {t('CHECKING_LATEST_FIRMWARE_VERSION')}
                  </span>
                )}
              </span>
            </section>,
            <section className="mb-5">
              <span className="has-text-white">
                {either(
                  isDownloaded,
                  t('YOU_HAVE_THE_LATEST_FIRMWARE', fileName)
                )}
                {either(
                  !isDownloaded && !isDownloading,
                  <span className="has-text-white has-text-weight-bold">
                    {t('CHECKING_LATEST_FIRMWARE_VERSION')}
                  </span>
                )}
              </span>
            </section>
          )}
          {either(
            isDownloaded && lastTimeDownloaded,
            <span className="mt-20 mb-10">
              {t('LAST_UPDATED')}:{' '}
              {moment.unix(lastTimeDownloaded / 1000).format('MM/DD/YYYY')}
            </span>
          )}
          {either(
            isDownloading,
            <section className="mt-20 mb-10">
              <p className="mb-5">
                <span className="mr-10 has-text-white has-text-weight-bold">
                  {progress}%
                </span>
                {either(isDownloading, t(step), t('NOT_DOWNLOADED'))}
                {either(
                  size,
                  <span className="is-pulled-right has-text-white has-text-weight-bold">
                    {size} MB
                  </span>
                )}
              </p>
              <progress
                className="progress is-tiny is-white"
                value={progress}
                max="100"
              />
            </section>
          )}
          {either(
            showReleaseNotes,
            <section className="mb-5">
              <Link className="has-text-weight-bold" onClick={goToReleaseNotes}>
                {t('RELEASE_NOTES')}
              </Link>
            </section>
          )}
        </>
      )}
    </Collapsible>
  )
}
export default FileCollapsible
