import { indexOf, pathOr } from 'ramda'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Loader } from 'components/Loader'
import UpdateFirmwareStage from 'components/UpdateFirmwareStage'
import usePVSInitConnection from 'hooks/usePVSInitConnection'
import useTimer from 'hooks/useTimer'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import {
  either,
  isError,
  pvs5FwupStages,
  pvs6FwupStages,
  SECONDS_TO_WAIT_FOR_PVS_TO_REBOOT,
  isPvs5
} from 'shared/utils'
import {
  INIT_FIRMWARE_UPDATE,
  FIRMWARE_UPDATE_ERROR,
  FIRMWARE_SET_LAST_SUCCESSFUL_STAGE
} from 'state/actions/firmwareUpdate'

import './UpdateScreen.scss'

const UpdateScreen = () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const history = useHistory()
  const { status, percent, upgrading, lastSuccessfulStage } = useSelector(
    state => state.firmwareUpdate
  )
  const { connecting, connected } = useSelector(state => state.network)
  const firmwareDownload = useSelector(
    pathOr({}, ['fileDownloader', 'progress'])
  )
  const pvsModel = useSelector(pathOr('', ['pvs', 'model']))
  const isPvs6 = !isPvs5(pvsModel)
  const pvsFwupStages = isPvs6 ? pvs6FwupStages : pvs5FwupStages
  const retryConnection = usePVSInitConnection()
  const [formattedTime, isTimerActive, activateTimer, , secondsLeft] = useTimer(
    SECONDS_TO_WAIT_FOR_PVS_TO_REBOOT,
    false
  )

  useEffect(() => {
    if (
      status === 'WAITING_FOR_NETWORK' &&
      !isTimerActive &&
      secondsLeft !== 0
    ) {
      activateTimer()
    }
  }, [activateTimer, isTimerActive, secondsLeft, status])

  useEffect(() => {
    const stepNumber = indexOf(status, pvsFwupStages)

    if (stepNumber !== -1) {
      console.warn('Dispatching FIRMWARE_SET_LAST_SUCCESSFUL_STAGE')
      console.warn({ stepNumber, stage: pvsFwupStages[stepNumber] })
      dispatch(FIRMWARE_SET_LAST_SUCCESSFUL_STAGE(stepNumber))
    }
  }, [status, pvsFwupStages, dispatch])

  const { fwFileInfo } = useSelector(({ fileDownloader }) => ({
    fwFileInfo: fileDownloader.fileInfo
  }))
  const isDownloadingFirmware =
    firmwareDownload.downloading &&
    fwFileInfo.name === firmwareDownload.fileName

  const errorUpdating = isError(status)

  const onGoBack = () => {
    dispatch(INIT_FIRMWARE_UPDATE({ PVSFromVersion: '' }))
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
    if (indexOf(stage, pvsFwupStages) === lastSuccessfulStage) {
      const progress = parseInt(percent)

      return isNaN(progress) ? 100 : progress
    }

    return lastSuccessfulStage < indexOf(stage, pvsFwupStages) ? 0 : 100
  }

  return (
    <div className="pvs-update-screen page-height pr-15 pl-15">
      <span className="is-uppercase has-text-weight-bold">HOLD ON</span>
      {either(!errorUpdating, <span>{t('DONT_CLOSE_APP_UPGRADING')}</span>)}
      <div className="percent-loader">
        {either(
          status !== 'UPGRADE_COMPLETE',
          <>
            {either(
              errorUpdating,
              <>
                <span className="sp-pvs" />
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
                    {either(
                      isPvs6,
                      <UpdateFirmwareStage
                        stage={t('STAGE_DECOMPRESSING')}
                        percent={getProgressForStage('decompressing images')}
                      />
                    )}
                    <UpdateFirmwareStage
                      stage={t('STAGE_FLASHING_IMAGES')}
                      percent={getProgressForStage('flashing images')}
                    />
                    {either(
                      isPvs6,
                      <UpdateFirmwareStage
                        stage={t('STAGE_VERIFYING_IMAGES')}
                        percent={getProgressForStage('verifying images')}
                      />
                    )}
                    <UpdateFirmwareStage
                      stage={t('STAGE_FW_UPGRADE_SUCCESS')}
                      percent={status !== 'WAITING_FOR_NETWORK' ? 0 : 100}
                    />
                    <UpdateFirmwareStage
                      stage={t('STAGE_COMPLETE')}
                      percent={getProgressForStage('complete')}
                    >
                      {either(
                        status === 'WAITING_FOR_NETWORK',
                        <div className="has-text-white">
                          {either(
                            secondsLeft === 0,
                            t('STAGE_COMPLETE_INSTRUCTIONS'),
                            t('WAITING_FOR_NETWORK', formattedTime)
                          )}
                        </div>
                      )}
                    </UpdateFirmwareStage>
                    {either(
                      secondsLeft === 0,
                      <button
                        className="mt-5 button is-primary is-uppercase"
                        onClick={() => retryConnection()}
                        disabled={connecting || connected}
                      >
                        {t(
                          either(
                            connecting,
                            'RECONNECTING',
                            either(connected, 'PLEASE_WAIT', 'RETRY_CONNECTION')
                          )
                        )}
                      </button>
                    )}
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
