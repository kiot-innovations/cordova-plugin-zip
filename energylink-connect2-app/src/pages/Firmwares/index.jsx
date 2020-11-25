import React, { useCallback, useEffect, useRef } from 'react'
import moment from 'moment'
import {
  always,
  complement,
  compose,
  head,
  identity,
  ifElse,
  isNil,
  match,
  pathOr,
  prop
} from 'ramda'
import { useDispatch, useSelector } from 'react-redux'

import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { DOWNLOAD_OS_INIT } from 'state/actions/ess'
import { MENU_DISPLAY_ITEM } from 'state/actions/ui'

import { PVS_FIRMWARE_DOWNLOAD_INIT } from 'state/actions/fileDownloader'
import { GRID_PROFILE_DOWNLOAD_INIT } from 'state/actions/gridProfileDownloader'
import Collapsible from 'components/Collapsible'
import FileCollapsible from 'components/FileCollapsible'

export const getFileName = compose(
  ifElse(complement(isNil), compose(head, match(/([0-9]+)$/)), identity),
  prop('displayName')
)
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

  const essState = useSelector(prop('ess'))

  const forceDownloadESS = compose(dispatch, DOWNLOAD_OS_INIT, always(true))

  const {
    gpError,
    gpLastModified,
    isDownloadingGridProfile,
    verification
  } = useSelector(({ fileDownloader }) => ({
    verification: fileDownloader.verification,
    gpError: fileDownloader.gridProfileInfo.error,
    isDownloadingGridProfile: fileDownloader.gridProfileInfo.progress !== 100,
    gpLastModified: fileDownloader.gridProfileInfo.lastModified,
    gpSize: fileDownloader.gridProfileInfo.size / 1024 / 1024
  }))

  const downloadFile = useCallback(
    () => dispatch(PVS_FIRMWARE_DOWNLOAD_INIT(true)),
    [dispatch]
  )

  const downloadGridProfiles = () => dispatch(GRID_PROFILE_DOWNLOAD_INIT(true))

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      if (!prop('pvsDownloading', verification)) {
        dispatch(PVS_FIRMWARE_DOWNLOAD_INIT())
      }
      if (!prop('gpDownloading', verification)) {
        dispatch(GRID_PROFILE_DOWNLOAD_INIT())
      }
      if (!prop('essDownloading', verification)) {
        dispatch(DOWNLOAD_OS_INIT())
      }
      isFirstRender.current = false
    }
  }, [dispatch, verification])

  return (
    <section className="is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">{t('FIRMWARE')}</h1>
      <FileCollapsible
        fileName={t('PVS_FIRMWARE')}
        version={getFileName(fwFileInfo)}
        error={fwFileInfo.error}
        downloadFile={downloadFile}
        isDownloaded={fwFileInfo.exists}
        isDownloading={isDownloading}
        step={fwFileInfo.step}
        size={getFileSize(fwFileInfo)}
        progress={progress}
        goToReleaseNotes={() =>
          dispatch(MENU_DISPLAY_ITEM('FIRMWARE_RELEASE_NOTES'))
        }
      />

      <Separator />
      <Collapsible
        title={t('GRID_PROFILES_PACKAGE')}
        actions={either(
          !isDownloadingGridProfile || gpError,
          <span
            className="is-size-4 sp-download"
            onClick={downloadGridProfiles}
          />
        )}
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
      <FileCollapsible
        fileName={t('STORAGE_FW_FILE')}
        downloadFile={forceDownloadESS}
        error={essState.error}
        isDownloading={essState.isDownloading}
        progress={essState.progress}
        step={essState.step}
        isDownloaded={essState.file}
        size={essState.total}
      />
    </section>
  )
}

export default Firmwares
