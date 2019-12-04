import React, { useCallback, useEffect } from 'react'
import Collapsible from 'components/Collapsible'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { useSpring, animated } from 'react-spring'
import * as fileDownloaderActions from 'state/actions/fileDownloader'
const actions = <span className="sp-stop is-size-4" />

function Firmwares() {
  const t = useI18n()
  const dispatch = useDispatch()
  const { progress, lastProgress, fileInfo } = useSelector(
    ({ fileDownloader }) => ({
      ...fileDownloader.progress,
      fileInfo: fileDownloader.fileInfo
    })
  )
  const downloadFile = useCallback(() => {
    dispatch(fileDownloaderActions.getFile())
  }, [dispatch])
  const springProgress = useSpring({
    from: { value: lastProgress },
    to: { value: progress }
  })

  useEffect(() => {
    downloadFile()
  }, [dispatch, downloadFile])
  return (
    <section className="is-flex tile is-vertical pt-0 pr-10 pl-10 fill-parent">
      <h1 className="has-text-centered is-uppercase pb-20">{t('FIRMWARE')}</h1>
      {fileInfo.error !== '' ? (
        <>
          <span>{`${t('FIRMWARE_ERROR_FOUND')}: ${fileInfo.error}`}</span>
          <button
            className="button is-primary mt-15 is-uppercase ml-25 mr-25"
            onClick={downloadFile}
          >
            {t('TRY_AGAIN')}
          </button>
        </>
      ) : (
        <Collapsible title={fileInfo.name} actions={actions} expanded>
          <p>This update contains the following fixes:</p>

          <ul>
            <li>-Changelog item 1</li>
            <li>-Changelog item 2</li>
            <li>-Changelog item 3</li>
            <li>-Changelog item 4</li>
          </ul>

          <section className="mt-20 mb-10">
            <p className="mb-5">
              <span className="mr-10 has-text-white has-text-weight-bold">
                {progress}%
              </span>
              {progress === 100 ? 'Downloaded' : 'Downloading'}
              {progress === 100 && (
                <span className="is-pulled-right has-text-white has-text-weight-bold">
                  {fileInfo.size}mb
                </span>
              )}
            </p>

            {progress !== 100 && (
              <animated.progress
                className="progress is-tiny is-white"
                value={springProgress.value}
                max="100"
              />
            )}
          </section>
        </Collapsible>
      )}
    </section>
  )
}

export default Firmwares
