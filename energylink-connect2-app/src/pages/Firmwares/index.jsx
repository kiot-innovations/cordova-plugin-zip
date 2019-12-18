import React, { useCallback, useEffect } from 'react'
import Collapsible from 'components/Collapsible'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { animated, useSpring } from 'react-spring'
import * as fileDownloaderActions from 'state/actions/fileDownloader'

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
        title={fileInfo.name}
        actions={
          !fileInfo.error ? (
            <span
              className={'is-size-4 sp-stop'}
              onClick={() => dispatch(fileDownloaderActions.abortDownload())}
            />
          ) : (
            <span className={'is-size-4 sp-download'} onClick={downloadFile} />
          )
        }
        expanded
      >
        {fileInfo.error ? (
          <>
            <span>{t('FIRMWARE_ERROR_FOUND')}</span>
          </>
        ) : (
          <>
            <section className="mt-20 mb-10">
              <p className="mb-5">
                <span className="mr-10 has-text-white has-text-weight-bold">
                  {progress}%
                </span>
                {progress === 100 ? 'Downloaded' : 'Downloading'}
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
          </>
        )}
      </Collapsible>
    </section>
  )
}

export default Firmwares
