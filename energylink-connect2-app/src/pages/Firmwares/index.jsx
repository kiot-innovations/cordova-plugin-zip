import Collapsible from 'components/Collapsible'
import useModal from 'hooks/useModal'
import moment from 'moment'
import { pathOr, prop } from 'ramda'
import React, { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import * as fileDownloaderActions from 'state/actions/fileDownloader'
import * as gridProfileDownloaderActions from 'state/actions/gridProfileDownloader'

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

const GridProfileFileStatus = ({ gpProgress, gpLastModified }) => {
  const t = useI18n()
  if (gpProgress !== 100) {
    return t('DOWNLOADING')
  }
  return either(
    gpLastModified,
    `${t('LAST_TIME_UPDATED')}:
      ${moment.unix(gpLastModified / 1000).format('MM/DD/YYYY')}`,
    t('FILE_NOT_PRESENT')
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
  const { fwProgress, fwDownloading, fwFileInfo } = useSelector(
    ({ fileDownloader }) => ({
      fwProgress: fileDownloader.progress.progress,
      fwDownloading: fileDownloader.progress.downloading,
      fwFileInfo: fileDownloader.fileInfo
    })
  )

  const {
    progress: gpProgress,
    error: gpError,
    lastModified: gpLastModified
  } = useSelector(pathOr({}, ['fileDownloader', 'gridProfileProgress']))

  const downloadFile = useCallback(
    () => dispatch(fileDownloaderActions.getFile()),
    [dispatch]
  )

  const downloadGridProfiles = () =>
    dispatch(gridProfileDownloaderActions.getFile())

  useEffect(() => {
    dispatch(fileDownloaderActions.getFile())
    dispatch(gridProfileDownloaderActions.setFileInfo())
  }, [dispatch, downloadFile])

  useEffect(() => {
    if (fwProgress === 100 && !fwDownloading && !gpLastModified) {
      dispatch(gridProfileDownloaderActions.getFile())
    }
  }, [dispatch, fwProgress, fwDownloading, gpLastModified])

  useEffect(() => {
    setModal(fwFileInfo.error === 'NO WIFI')
  }, [fwFileInfo.error, setModal])

  return (
    <section className="is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
      {modal}
      <h1 className="has-text-centered is-uppercase pb-20">{t('FIRMWARE')}</h1>
      <Collapsible
        title={getFileName(fwFileInfo)}
        actions={
          !fwFileInfo.error ? (
            fwProgress !== 0 &&
            fwProgress !== 100 && (
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
          fwFileInfo.error,
          <span>{t('FIRMWARE_ERROR_FOUND')}</span>,
          <section className="mt-20 mb-10">
            <p className="mb-5">
              <span className="mr-10 has-text-white has-text-weight-bold">
                {fwProgress}%
              </span>
              {fwProgress === 100 ? t('DOWNLOADED') : t('DOWNLOADING')}
              <span className="is-pulled-right has-text-white has-text-weight-bold">
                {getFileSize(fwFileInfo)}MB
              </span>
            </p>
            {fwProgress !== 100 && (
              <progress
                className="progress is-tiny is-white"
                value={fwProgress}
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
          fwProgress === 100 && gpProgress !== 100 ? (
            <span
              className={'is-size-4 sp-stop'}
              onClick={() => dispatch(fileDownloaderActions.abortDownload())}
            />
          ) : (
            <span
              className={'is-size-4 sp-download'}
              onClick={downloadGridProfiles}
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
              <GridProfileFileStatus
                gpLastModified={gpLastModified}
                gpProgress={gpProgress}
              />
            </p>
            {fwProgress === 100 && gpProgress !== 100 && (
              <progress
                className="progress is-tiny is-white"
                value={gpProgress}
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
