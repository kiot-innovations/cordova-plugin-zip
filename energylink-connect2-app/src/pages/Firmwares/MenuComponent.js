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
import { GRID_PROFILE_DOWNLOAD_INIT } from 'state/actions/gridProfileDownloader'
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
    gpError,
    gpLastModified,
    gpSize,
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
        fileName={t('GRID_PROFILES_PACKAGE')}
        downloadFile={downloadGridProfiles}
        error={gpError}
        lastTimeDownloaded={gpLastModified}
        isDownloading={isDownloadingGridProfile}
        isDownloaded={!isDownloadingGridProfile || gpSize !== 0}
        size={gpSize.toFixed(2)}
        expanded={showDetails}
      />
      {children}
    </section>
  )
}

export default FirmwaresMenu
