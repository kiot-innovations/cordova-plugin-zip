import clsx from 'clsx'
import FileCollapsible from 'components/FileCollapsible'
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
import React, { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { DOWNLOAD_OS_INIT } from 'state/actions/ess'

import { PVS_FIRMWARE_DOWNLOAD_INIT } from 'state/actions/fileDownloader'
import {
  PVS6_GRID_PROFILE_DOWNLOAD_INIT,
  PVS5_GRID_PROFILE_DOWNLOAD_INIT
} from 'state/actions/gridProfileDownloader'
import { MENU_DISPLAY_ITEM } from 'state/actions/ui'

export const getFileName = compose(
  ifElse(complement(isNil), compose(head, match(/([0-9]+)$/)), identity),
  prop('displayName')
)
export const getFileSize = prop('size')

const Separator = () => <div className="mt-20" />

function FirmwaresMenu({ message, children, className, showDetails = true }) {
  const t = useI18n()
  const dispatch = useDispatch()

  const { progress, downloading: isDownloading } = useSelector(
    pathOr({}, ['fileDownloader', 'progress'])
  )

  const fwFileInfo = useSelector(pathOr('', ['fileDownloader', 'fileInfo']))
  const essState = useSelector(prop('ess'))

  const forceDownloadESS = compose(dispatch, DOWNLOAD_OS_INIT, always(true))

  const {
    pvs6GpError,
    pvs5GpError,
    pvs6GpLastModified,
    pvs5GpLastModified,
    pvs6GpSize,
    pvs5GpSize,
    isDownloadingPvs6GridProfile,
    isDownloadingPvs5GridProfile,
    verification
  } = useSelector(({ fileDownloader }) => ({
    pvs6GpError: fileDownloader.pvs6GridProfileInfo.error,
    pvs5GpError: fileDownloader.pvs5GridProfileInfo.error,
    pvs6GpLastModified: fileDownloader.pvs6GridProfileInfo.lastModified,
    pvs5GpLastModified: fileDownloader.pvs5GridProfileInfo.lastModified,
    pvs6GpSize: fileDownloader.pvs6GridProfileInfo.size / 1024 / 1024,
    pvs5GpSize: fileDownloader.pvs5GridProfileInfo.size / 1024 / 1024,
    isDownloadingPvs6GridProfile:
      fileDownloader.pvs6GridProfileInfo.progress !== 100,
    isDownloadingPvs5GridProfile:
      fileDownloader.pvs5GridProfileInfo.progress !== 100,
    verification: fileDownloader.verification
  }))

  const downloadFile = useCallback(
    () => dispatch(PVS_FIRMWARE_DOWNLOAD_INIT(true)),
    [dispatch]
  )

  const downloadPvs6GridProfiles = () =>
    dispatch(PVS6_GRID_PROFILE_DOWNLOAD_INIT(true))
  const downloadPvs5GridProfiles = () =>
    dispatch(PVS5_GRID_PROFILE_DOWNLOAD_INIT(true))

  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      if (!prop('pvsDownloading', verification)) {
        dispatch(PVS_FIRMWARE_DOWNLOAD_INIT())
      }
      if (!prop('pvs6GpDownloading', verification)) {
        dispatch(PVS6_GRID_PROFILE_DOWNLOAD_INIT())
      }
      if (!prop('pvs5GpDownloading', verification)) {
        dispatch(PVS5_GRID_PROFILE_DOWNLOAD_INIT())
      }
      if (!prop('essDownloading', verification)) {
        dispatch(DOWNLOAD_OS_INIT())
      }
      isFirstRender.current = false
    }
  }, [dispatch, verification])

  return (
    <section
      className={clsx(
        'is-flex tile is-vertical pt-0 pr-10 pl-10 full-height firmware-screen',
        className
      )}
    >
      <h1 className="has-text-centered is-uppercase pb-20">{t('FIRMWARE')}</h1>
      {either(message, <p className="pb-20">{message}</p>)}
      <FileCollapsible
        fileName={t('PVS_FIRMWARE')}
        version={prop('version', fwFileInfo)}
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
        lastTimeDownloaded={fwFileInfo.lastModified}
        expanded={showDetails}
      />

      <Separator />
      <FileCollapsible
        fileName={t('STORAGE_FW_FILE')}
        version={prop('version', essState)}
        downloadFile={forceDownloadESS}
        error={essState.error}
        isDownloading={essState.isDownloading}
        progress={essState.progress}
        step={essState.step}
        isDownloaded={essState.file}
        size={essState.total}
        lastTimeDownloaded={essState.lastModified}
        expanded={showDetails}
      />

      <Separator />
      <FileCollapsible
        fileName={t('GRID_PROFILES_PVS6_PACKAGE')}
        downloadFile={downloadPvs6GridProfiles}
        error={pvs6GpError}
        lastTimeDownloaded={pvs6GpLastModified}
        isDownloading={isDownloadingPvs6GridProfile}
        isDownloaded={!isDownloadingPvs6GridProfile || pvs6GpSize !== 0}
        size={pvs6GpSize.toFixed(2)}
        expanded={showDetails}
      />

      <Separator />
      <FileCollapsible
        fileName={t('GRID_PROFILES_PVS5_PACKAGE')}
        downloadFile={downloadPvs5GridProfiles}
        error={pvs5GpError}
        lastTimeDownloaded={pvs5GpLastModified}
        isDownloading={isDownloadingPvs5GridProfile}
        isDownloaded={!isDownloadingPvs5GridProfile || pvs5GpSize !== 0}
        size={pvs5GpSize.toFixed(2)}
        expanded={showDetails}
      />
      {children}
    </section>
  )
}

export default FirmwaresMenu
