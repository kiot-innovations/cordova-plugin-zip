import clsx from 'clsx'
import React from 'react'
import { useI18n } from 'shared/i18n'
import Collapsible from 'components/Collapsible'
import { either } from 'shared/utils'

const FileCollapsible = ({
  progress = 0,
  error = null,
  fileName = '',
  isDownloading = false,
  isDownloaded = false,
  version = '',
  downloadFile,
  step = '',
  size = 10
}) => {
  const t = useI18n()
  return (
    <Collapsible
      title={fileName}
      actions={either(
        !isDownloading && (error || isDownloaded),
        <span
          className={clsx('is-size-4', {
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
                {t('VERSION')}: {version}
              </span>
            </section>
          )}
          <section className="mt-20 mb-10">
            <p className="mb-5">
              <span className="mr-10 has-text-white has-text-weight-bold">
                {either(isDownloading, progress, 100)}%
              </span>
              {either(
                isDownloading,
                t(step),
                !isDownloaded ? t('NOT_DOWNLOADED') : t('DOWNLOADED')
              )}
              {either(
                size,
                <span className="is-pulled-right has-text-white has-text-weight-bold">
                  {size} MB
                </span>
              )}
            </p>
            {either(
              isDownloading,
              <progress
                className="progress is-tiny is-white"
                value={progress}
                max="100"
              />
            )}
          </section>
        </>
      )}
    </Collapsible>
  )
}
export default FileCollapsible
