import Collapsible from 'components/Collapsible'
import moment from 'moment'
import { pathOr, prop } from 'ramda'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import * as fileDownloaderActions from 'state/actions/fileDownloader'
import * as gridProfileDownloaderActions from 'state/actions/gridProfileDownloader'

export const getFileName = prop('name')
export const getFileSize = prop('size')

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

  return (
    <section className="is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
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
