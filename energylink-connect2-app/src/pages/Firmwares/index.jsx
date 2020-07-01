import Collapsible from 'components/Collapsible'
import moment from 'moment'
import { pathOr, prop } from 'ramda'
import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGridProfileFileName } from 'shared/fileSystem'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { DOWNLOAD_META_INIT, DOWNLOAD_OS_INIT } from 'state/actions/ess'
import * as fileDownloaderActions from 'state/actions/fileDownloader'
import * as gridProfileDownloaderActions from 'state/actions/gridProfileDownloader'
import EssCollapsible from './EssCollapsible'

export const getFileName = prop('displayName')
export const getFileSize = prop('size')

const Separator = () => <div className="mt-20" />

const GridProfileFileStatus = ({ downloading, gpLastModified }) => {
  const t = useI18n()
  if (downloading) {
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

  const { fileName: downloadingFileName, progress, downloading } = useSelector(
    pathOr({}, ['fileDownloader', 'progress'])
  )

  const { fwFileInfo } = useSelector(({ fileDownloader }) => ({
    fwFileInfo: fileDownloader.fileInfo
  }))

  const { gpError, gpLastModified } = useSelector(({ fileDownloader }) => ({
    gpError: fileDownloader.gridProfileInfo.error,
    gpLastModified: fileDownloader.gridProfileInfo.lastModified
  }))

  const isDownloadingGridProfile =
    downloading && getGridProfileFileName() === downloadingFileName
  const isDownloadingFirmware =
    downloading && fwFileInfo.name === downloadingFileName

  const downloadFile = useCallback(
    () => dispatch(fileDownloaderActions.FIRMWARE_DOWNLOAD_INIT()),
    [dispatch]
  )

  const downloadGridProfiles = () =>
    dispatch(gridProfileDownloaderActions.GRID_PROFILE_DOWNLOAD_INIT())

  const downloadAbort = () => dispatch(fileDownloaderActions.DOWNLOAD_ABORT())

  useEffect(() => {
    dispatch(fileDownloaderActions.FIRMWARE_GET_FILE())
    dispatch(gridProfileDownloaderActions.GRID_PROFILE_GET_FILE())
    dispatch(DOWNLOAD_OS_INIT())
    dispatch(DOWNLOAD_META_INIT())
  }, [dispatch])

  return (
    <section className="is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">{t('FIRMWARE')}</h1>
      <Collapsible
        title={getFileName(fwFileInfo)}
        actions={
          !fwFileInfo.error ? (
            isDownloadingFirmware && (
              <span className="is-size-4 sp-stop" onClick={downloadAbort} />
            )
          ) : (
            <span className="is-size-4 sp-download" onClick={downloadFile} />
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
                {either(
                  isDownloadingFirmware,
                  progress,
                  fwFileInfo.exists ? 100 : 0
                )}
                %
              </span>
              {either(
                isDownloadingFirmware,
                t('DOWNLOADING'),
                fwFileInfo.exists ? t('DOWNLOADED') : t('NOT_DOWNLOADED')
              )}
              <span className="is-pulled-right has-text-white has-text-weight-bold">
                {getFileSize(fwFileInfo)}MB
              </span>
            </p>
            {isDownloadingFirmware && (
              <progress
                className="progress is-tiny is-white"
                value={progress}
                max="100"
              />
            )}
          </section>
        )}
      </Collapsible>
      <Separator />
      <Collapsible
        title={t('GRID_PROFILES_PACKAGE')}
        actions={
          isDownloadingGridProfile ? (
            <span className="is-size-4 sp-stop" onClick={downloadAbort} />
          ) : (
            <span
              className="is-size-4 sp-download"
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
                downloading={isDownloadingGridProfile}
              />
            </p>
            {isDownloadingGridProfile && (
              <progress
                className="progress is-tiny is-white"
                value={progress}
                max="100"
              />
            )}
          </section>
        )}
      </Collapsible>
      <Separator />
      <EssCollapsible />
    </section>
  )
}

export default Firmwares
