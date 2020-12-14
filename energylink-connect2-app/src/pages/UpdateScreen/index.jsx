import React, { useEffect } from 'react'
import { indexOf, pathOr } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Loader } from 'components/Loader'
import UpdateFirmwareStage from 'components/UpdateFirmwareStage'
import { useI18n } from 'shared/i18n'
import { either, isError } from 'shared/utils'
import {
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_SET_LAST_SUCCESSFUL_STAGE
} from 'state/actions/firmwareUpdate'
import paths from 'routes/paths'
import useTimer from 'hooks/useTimer'

import './UpdateScreen.scss'

const stagesFromThePvs = [
  'downloading images',
  'decompressing images',
  'flashing images',
  'verifying images',
  'complete'
]

const WaitForConnection = () => {
  const [formattedTime] = useTimer(100, true)
  const t = useI18n()
  return (
    <div className="has-text-white">
      {t('WAITING_FOR_NETWORK', formattedTime)}
    </div>
  )
}

const UpdateScreen = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const { status, percent, upgrading, lastSuccessfulStage } = useSelector(
    state => state.firmwareUpdate
  )
  const firmwareDownload = useSelector(
    pathOr({}, ['fileDownloader', 'progress'])
  )

  useEffect(() => {
    const stepNumber = indexOf(status, stagesFromThePvs)
    if (stepNumber !== -1) {
      dispatch(FIRMWARE_SET_LAST_SUCCESSFUL_STAGE(stepNumber))
    }
  }, [status, dispatch])

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

  const getProgressForStage = stage => {
    if (indexOf(stage, stagesFromThePvs) === lastSuccessfulStage) {
      return parseInt(percent)
    }
    return lastSuccessfulStage < indexOf(stage, stagesFromThePvs) ? 0 : 100
  }

  return (
    <div className="pvs-update-screen page-height pr-15 pl-15">
      <span className="is-uppercase has-text-weight-bold">HOLD ON</span>
      {either(!errorUpdating, <span>{t('DONT_CLOSE_APP_UPGRADING')}</span>)}
      <div className="percent-loader">
        {either(
          status === 'UPGRADE_COMPLETE',
          null,
          <>
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
                  <>
                    <UpdateFirmwareStage
                      stage={t('STAGE_DOWNLOADING_IMAGES')}
                      percent={either(
                        status === 'verifying download',
                        0,
                        getProgressForStage('downloading images')
                      )}
                      waiting
                    />
                    <UpdateFirmwareStage
                      stage={t('STAGE_DECOMPRESSING')}
                      percent={getProgressForStage('decompressing images')}
                    />
                    <UpdateFirmwareStage
                      stage={t('STAGE_FLASHING_IMAGES')}
                      percent={getProgressForStage('flashing images')}
                    />
                    <UpdateFirmwareStage
                      stage={t('STAGE_VERIFYING_IMAGES')}
                      percent={getProgressForStage('verifying images')}
                    />
                    <UpdateFirmwareStage
                      stage={t('STAGE_COMPLETE')}
                      percent={getProgressForStage('complete')}
                    >
                      {either(
                        status === 'WAITING_FOR_NETWORK',
                        <WaitForConnection />
                      )}
                    </UpdateFirmwareStage>
                  </>
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
