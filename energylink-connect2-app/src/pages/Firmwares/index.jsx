import Collapsible from 'components/Collapsible'
import useModal from 'hooks/useModal'
import * as moment from 'moment'
import { prop } from 'ramda'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import * as fileDownloaderActions from 'state/actions/fileDownloader'
import {
  getGridProfileFile,
  setFileInfo
} from 'state/actions/gridProfileDownloader'

export const getFileName = prop('name')
export const getFileSize = prop('size')

const modalContent = (dispatch, t) => (
  <div className="has-text-centered">
    <span className="has-text-white">{t('NO_WIFI')}</span>
    <div>
      <button
        onClick={() => {
          dispatch(fileDownloaderActions.getFile(false))
        }}
        className="button is-primary is-uppercase is-center mt-20"
      >
        {t('DOWNLOAD_ANYWAY')}
      </button>
    </div>
  </div>
)
const modalTitle = t => (
  <span className="has-text-white has-text-weight-bold">{t('ATTENTION')}</span>
)

const GridProfileFileStatus = ({ gpProgress, lastModified }) => {
  const t = useI18n()
  return either(
    gpProgress === 100,
    lastModified
      ? `${t('LAST_TIME_UPDATED')}: ${moment
          .unix(lastModified / 1000)
          .format('MM/DD/YYYY')}`
      : t('FILE_NOT_PRESENT'),
    t('DOWNLOADING')
  )
}

function Firmwares() {
  const t = useI18n()
  const dispatch = useDispatch()
  const { setModal, modal } = useModal(
    modalContent(dispatch, t),
    modalTitle(t),
    false
  )
  const { progress, lastProgress, fileInfo } = useSelector(
    ({ fileDownloader }) => ({
      ...fileDownloader.progress,
      fileInfo: fileDownloader.fileInfo
    })
  )

  const {
    progress: gpProgress,
    lastProgress: gpLastProgress,
    error: gpError,
    lastModified
  } = useSelector(({ fileDownloader }) => ({
    ...fileDownloader.gridProfileProgress
  }))

  const springProgress = useSpring({
    from: { value: lastProgress },
    to: { value: progress }
  })
  const gpSpringProgress = useSpring({
    from: { value: gpLastProgress },
    to: { value: gpProgress }
  })
  const downloadFile = useCallback(
    () => dispatch(fileDownloaderActions.getFile()),
    [dispatch]
  )

  const downlaodGridProfiles = useCallback(
    () => dispatch(getGridProfileFile()),
    [dispatch]
  )

  useEffect(() => {
    downloadFile()
    dispatch(setFileInfo())
  }, [dispatch, downloadFile])

  useEffect(() => {
    setModal(fileInfo.error === 'NO WIFI')
  }, [fileInfo.error, setModal])

  return (
    <section className="is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
      {modal}
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
                {getFileSize(fileInfo)}MB
              </span>
            </p>
            {progress !== 100 && (
              <progress
                className="progress is-tiny is-white"
                value={springProgress.value}
                max="100"
              />
            )}
          </section>
        )}
      </Collapsible>
      <div className="separator" />
      <Collapsible
        title={t('GRID_PROFILES_PACKAGE')}
        actions={
          progress === 100 && gpProgress !== 100 ? (
            <span
              className={'is-size-4 sp-stop'}
              onClick={() => dispatch(fileDownloaderActions.abortDownload())}
            />
          ) : (
            <span
              className={'is-size-4 sp-download'}
              onClick={downlaodGridProfiles}
            />
          )
        }
        expanded
      >
        {either(
          gpError,
          <span>{t('GRID_PROFILE_ERROR_FOUND')}</span>,
          <section className="mt-20 mb-10">
            <p className="mb-5">
              <span className="mr-10 has-text-white has-text-weight-bold">
                {gpProgress}%
              </span>
              <GridProfileFileStatus
                lastModified={lastModified}
                gpProgress={gpProgress}
              />
            </p>
            {gpProgress !== 100 && (
              <progress
                className="progress is-tiny is-white"
                value={gpSpringProgress.value}
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
