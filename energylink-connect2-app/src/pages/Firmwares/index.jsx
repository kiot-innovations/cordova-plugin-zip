import React, { useCallback, useEffect } from 'react'
import moment from 'moment'
import { pathOr, prop } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'

import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { DOWNLOAD_META_INIT, DOWNLOAD_OS_INIT } from 'state/actions/ess'

import { PVS_FIRMWARE_DOWNLOAD_INIT } from 'state/actions/fileDownloader'
import { GRID_PROFILE_DOWNLOAD_INIT } from 'state/actions/gridProfileDownloader'
import Collapsible from 'components/Collapsible'

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

  const { progress, downloading: isDownloading } = useSelector(
    pathOr({}, ['fileDownloader', 'progress'])
  )

  const fwFileInfo = useSelector(pathOr('', ['fileDownloader', 'fileInfo']))

  const { gpError, gpLastModified, isDownloadingGridProfile } = useSelector(
    ({ fileDownloader }) => ({
      gpError: fileDownloader.gridProfileInfo.error,
      isDownloadingGridProfile: fileDownloader.gridProfileInfo.progress !== 100,
      gpLastModified: fileDownloader.gridProfileInfo.lastModified
    })
  )

  const downloadFile = useCallback(
    () => dispatch(PVS_FIRMWARE_DOWNLOAD_INIT(true)),
    [dispatch]
  )

  const downloadGridProfiles = () => dispatch(GRID_PROFILE_DOWNLOAD_INIT(true))

  useEffect(() => {
    dispatch(PVS_FIRMWARE_DOWNLOAD_INIT())
    dispatch(GRID_PROFILE_DOWNLOAD_INIT())
    dispatch(DOWNLOAD_OS_INIT())
    dispatch(DOWNLOAD_META_INIT())
  }, [dispatch])

  return (
    <section className="is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">{t('FIRMWARE')}</h1>
      <Collapsible
        actions={either(
          fwFileInfo.error,
          <span className="is-size-4 sp-download" onClick={downloadFile} />
        )}
        title={getFileName(fwFileInfo)}
        expanded
      >
        {either(
          fwFileInfo.error,
          <span>{t('FIRMWARE_ERROR_FOUND')}</span>,
          <section className="mt-20 mb-10">
            <p className="mb-5">
              <span className="mr-10 has-text-white has-text-weight-bold">
                {either(isDownloading, progress, fwFileInfo.exists ? 100 : 0)}%
              </span>
              {either(
                isDownloading,
                t(fwFileInfo.step),
                fwFileInfo.exists ? t('DOWNLOADED') : t('NOT_DOWNLOADED')
              )}
              <span className="is-pulled-right has-text-white has-text-weight-bold">
                {getFileSize(fwFileInfo)}MB
              </span>
            </p>
            {isDownloading && (
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
          isDownloadingGridProfile ? null : (
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
