import React, { useEffect } from 'react'
import { pathOr } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Loader } from 'components/Loader'
import { useI18n } from 'shared/i18n'
import { capitalize, either, isError } from 'shared/utils'
import { FIRMWARE_UPDATE_ERROR } from 'state/actions/firmwareUpdate'
import paths from 'routes/paths'
import useTimer from 'hooks/useTimer'

import './UpdateScreen.scss'

const WaitForConnection = () => {
  const [formattedTime] = useTimer(100, true)
  const t = useI18n()
  return (
    <>
      <span className="has-text-white is-size-4">
        {t('WAITING_FOR_NETWORK', formattedTime)}
      </span>
      <span className="has-text-white is-size-6">{t('TIME_LEFT')}</span>
    </>
  )
}

const UpdateScreen = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const { status, percent, upgrading } = useSelector(
    state => state.firmwareUpdate
  )
  const firmwareDownload = useSelector(
    pathOr({}, ['fileDownloader', 'progress'])
  )
  const { fwFileInfo } = useSelector(({ fileDownloader }) => ({
    fwFileInfo: fileDownloader.fileInfo
  }))
  const isDownloadingFirmware =
    firmwareDownload.downloading &&
    fwFileInfo.name === firmwareDownload.fileName

  const errorUpdating = isError(status, percent)

  const onGoBack = () => {
    history.push(paths.PROTECTED.CONNECT_TO_PVS.path)
  }

  const onGotoFirmware = () => {
    history.push(paths.PROTECTED.MANAGE_FIRMWARES.path)
  }

  useEffect(() => {
    if (errorUpdating && upgrading) {
      dispatch(FIRMWARE_UPDATE_ERROR())
    }
  }, [errorUpdating, dispatch, upgrading])

  return (
    <div className="pvs-update-screen page-height pr-20 pl-30">
      <span className="is-uppercase has-text-weight-bold">HOLD ON</span>
      <span className="sp-pvs" />
      {either(!errorUpdating, <span>{t('DONT_CLOSE_APP_UPGRADING')}</span>)}
      <div className="percent-loader">
        {either(
          status === 'UPGRADE_COMPLETE',
          null,
          <>
            {either(
              (status !== 'UPLOADING_FS' &&
                !errorUpdating &&
                status !== 'WAITING_FOR_NETWORK') ||
                (isDownloadingFirmware && !errorUpdating),

              <span className="update-percentage has-text-white is-size-1">
                {(isDownloadingFirmware
                  ? firmwareDownload.progress
                  : percent) || 0}
                %
              </span>
            )}

            {either(
              errorUpdating,
              <>
                <span className="mt-20"> {t('FWUP_ERROR')} </span>
                <div className="mt-20 is-flex actions">
                  <button
                    className="button mb-15 is-primary"
                    onClick={onGoBack}
                  >
                    {t('START_OVER')}
                  </button>
                  <button
                    className="button is-secondary"
                    onClick={onGotoFirmware}
                  >
                    {t('FIRMWARE')}
                  </button>
                </div>
              </>,
              <>
                {either(
                  isDownloadingFirmware,
                  <div>
                    <Loader />
                    <span className="has-text-white">
                      {t('DOWNLOADING_FIRMWARE')}
                    </span>
                  </div>,
                  either(
                    status === 'WAITING_FOR_NETWORK',
                    <WaitForConnection />,
                    <span className="has-text-white">
                      {capitalize(t(status))}
                    </span>
                  )
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UpdateScreen
