import { prop } from 'ramda'
import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  DOWNLOAD_PROGRESS,
  DOWNLOAD_FINISHED
} from 'state/actions/fileDownloader'
import { ERROR_CODES } from 'shared/fileSystem'
import { SHOW_MODAL } from 'state/actions/modal'

export default () => {
  const dispatch = useDispatch()

  const downloadProgress = useCallback(
    event => dispatch(DOWNLOAD_PROGRESS({ progress: prop(0, event.data) })),
    [dispatch]
  )

  const downloadSuccess = useCallback(
    event => dispatch(DOWNLOAD_FINISHED({ ...prop(0, event.data) })),
    [dispatch]
  )

  const downloadError = useCallback(
    event => dispatch(DOWNLOAD_FINISHED.asError()),
    [dispatch]
  )

  const downloadNoWifi = useCallback(
    event => {
      dispatch(DOWNLOAD_FINISHED.asError(ERROR_CODES.noWifi))
      dispatch(
        SHOW_MODAL({
          title: 'UNABLE_DOWNLOAD_FILES_TITLE',
          body: 'UNABLE_DOWNLOAD_FILES_BODY',
          dismissable: true
        })
      )
    },
    [dispatch]
  )

  useEffect(() => {
    if (window.downloader) {
      document.addEventListener('DOWNLOADER_downloadProgress', downloadProgress)
      document.addEventListener('DOWNLOADER_downloadSuccess', downloadSuccess)
      document.addEventListener('DOWNLOADER_downloadError', downloadError)
      document.addEventListener('DOWNLOADER_noWifiConnection', downloadNoWifi)
    }
  }, [downloadError, downloadNoWifi, downloadProgress, downloadSuccess])

  useEffect(() => {
    return () => {
      if (window.downloader) {
        document.removeEventListener(
          'DOWNLOADER_downloadProgress',
          downloadProgress
        )
        document.removeEventListener(
          'DOWNLOADER_downloadSuccess',
          downloadSuccess
        )
        document.removeEventListener('DOWNLOADER_downloadError', downloadError)
        document.addEventListener('DOWNLOADER_noWifiConnection', downloadNoWifi)
      }
    }
  }, [downloadError, downloadNoWifi, downloadProgress, downloadSuccess])
}
