import clsx from 'clsx'
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
  prop,
  propEq,
  propOr
} from 'ramda'
import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FileCollapsible from 'components/FileCollapsible'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { DOWNLOAD_OS_INIT } from 'state/actions/ess'
import {
  PVS5_FW_DOWNLOAD_INIT,
  PVS_FIRMWARE_DOWNLOAD_INIT
} from 'state/actions/fileDownloader'
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
  const forceDownloadPVS5 = compose(
    dispatch,
    PVS5_FW_DOWNLOAD_INIT,
    always(true)
  )
  const downloadFile = compose(
    dispatch,
    PVS_FIRMWARE_DOWNLOAD_INIT,
    always(true)
  )
  const {
    pvs6GpError,
    pvs5GpError,
    pvs6GpLastModified,
    pvs5GpLastModified,
    pvs6GpSize,
    pvs5GpSize,
    isDownloadingPvs6GridProfile,
    isDownloadingPvs5GridProfile,
    verification,
    pvs5Fw,
    pvs5Scripts,
    pvs5Kernel
  } = useSelector(({ fileDownloader }) => ({
    pvs5Fw: propOr({}, 'pvs5Fw', fileDownloader),
    pvs5Scripts: propOr({}, 'pvs5Scripts', fileDownloader),
    pvs5Kernel: propOr({}, 'pvs5Kernel', fileDownloader),
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
        fileName={t('PVS6_FIRMWARE')}
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
        fileName={t('PVS5_FIRMWARE')}
        version={prop('version', pvs5Fw)}
        error={propEq('status', 'error', pvs5Fw)}
        downloadFile={forceDownloadPVS5}
        isDownloaded={propEq('status', 'downloaded', pvs5Fw)}
        isDownloading={propEq('status', 'downloading', pvs5Fw)}
        step={prop('step', pvs5Fw)}
        size={prop('size', pvs5Fw)}
        progress={prop('progress', pvs5Fw)}
        lastTimeDownloaded={prop('lastModified', pvs5Fw)}
        expanded={showDetails}
      />

      <Separator />

      <FileCollapsible
        fileName={t('PVS5_SCRIPTS')}
        version={prop('version', pvs5Scripts)}
        error={propEq('status', 'error', pvs5Scripts)}
        downloadFile={forceDownloadPVS5}
        isDownloaded={propEq('status', 'downloaded', pvs5Scripts)}
        isDownloading={propEq('status', 'downloading', pvs5Scripts)}
        step={prop('step', pvs5Scripts)}
        size={prop('size', pvs5Scripts)}
        progress={prop('progress', pvs5Scripts)}
        lastTimeDownloaded={prop('lastModified', pvs5Scripts)}
        expanded={showDetails}
      />

      <Separator />

      <FileCollapsible
        fileName={t('PVS5_KERNEL')}
        version={prop('version', pvs5Kernel)}
        error={propEq('status', 'error', pvs5Kernel)}
        downloadFile={forceDownloadPVS5}
        isDownloaded={propEq('status', 'downloaded', pvs5Kernel)}
        isDownloading={propEq('status', 'downloading', pvs5Kernel)}
        step={prop('step', pvs5Kernel)}
        size={prop('size', pvs5Kernel)}
        progress={prop('progress', pvs5Kernel)}
        lastTimeDownloaded={prop('lastModified', pvs5Kernel)}
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
