import Collapsible from 'components/Collapsible'
import { prop } from 'ramda'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { animated, useSpring } from 'react-spring'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import * as fileDownloaderActions from 'state/actions/fileDownloader'

export const getFileName = prop('name')

function Firmwares({ animationState }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const { progress, lastProgress, fileInfo } = useSelector(
    ({ fileDownloader }) => ({
      ...fileDownloader.progress,
      fileInfo: fileDownloader.fileInfo
    })
  )
  const springProgress = useSpring({
    from: { value: lastProgress },
    to: { value: progress }
  })
  const downloadFile = useCallback(
    () => dispatch(fileDownloaderActions.getFile()),
    [dispatch]
  )
  useEffect(() => {
    if (animationState === 'enter') downloadFile()
  }, [dispatch, downloadFile, animationState])
  return (
    <section className="is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">{t('FIRMWARE')}</h1>
      <Collapsible
        title={getFileName(fileInfo)}
        actions={
          !fileInfo.error ? (
            progress !== 0 &&
            progress !== 100 && (
              <span
                className={'is-size-4 sp-stop'}
                onClick={() => dispatch(fileDownloaderActions.abortDownload())}
              />
            )
          ) : (
            <span className={'is-size-4 sp-download'} onClick={downloadFile} />
          )
        }
        expanded
      >
        {either(
          fileInfo.error,
          <span>{t('FIRMWARE_ERROR_FOUND')}</span>,
          <section className="mt-20 mb-10">
            <p className="mb-5">
              <span className="mr-10 has-text-white has-text-weight-bold">
                {progress}%
              </span>
              {progress === 100 ? t('DOWNLOADED') : t('DOWNLOADING')}
              <span className="is-pulled-right has-text-white has-text-weight-bold">
                {fileInfo.size}mb
              </span>
            </p>
            {progress !== 100 && (
              <animated.progress
                className="progress is-tiny is-white"
                value={springProgress.value}
                max="100"
              />
            )}
          </section>
        )}
      </Collapsible>
    </section>
  )
}

export default Firmwares
