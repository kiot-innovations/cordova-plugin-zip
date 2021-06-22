import React, { useEffect, useState } from 'react'
import useModal from 'hooks/useModal'
import { isEmpty, length, pathOr } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { either, miTypes, filterFoundMI, miStates } from 'shared/utils'
import { useI18n } from 'shared/i18n'
import {
  CLAIM_DEVICES_INIT,
  DISCOVER_COMPLETE,
  FETCH_CANDIDATES_COMPLETE,
  FETCH_CANDIDATES_INIT,
  FETCH_DEVICES_LIST,
  PUSH_CANDIDATES_INIT,
  RESET_DISCOVERY,
  SAVE_OK_MI
} from 'state/actions/devices'
import paths from 'routes/paths'
import Collapsible from 'components/Collapsible'
import ProgressIndicators from './ProgressIndicators'
import DiscoveryStatus from './DiscoveryStatus'

import './Devices.scss'

const microInverterIcon = (
  <span className="sp-inverter mr-20 devices-icon ml-0 mt-0 mb-0" />
)

const miIndicators = {
  MI_OK: <span className="is-size-4 mr-10 sp-check has-text-white" />,
  ERROR: <span className="is-size-4 mr-10 sp-hey has-text-primary" />,
  LOADING: (
    <div className="inline-loader">
      <div className="ball-scale-ripple">
        <div />
      </div>
    </div>
  )
}

const miActions = (num = 0, max = 0) => (
  <div>
    <span className="devices-counter mr-10 ml-0 mt-0 mb-0">{`${num}/${max}`}</span>
  </div>
)

function Devices() {
  const dispatch = useDispatch()
  const history = useHistory()
  const t = useI18n()

  const { serialNumbers } = useSelector(state => state.pvs)

  const {
    candidates,
    claimingDevices,
    claimedDevices,
    claimError,
    claimProgress,
    error,
    progress,
    discoveryComplete
  } = useSelector(state => state.devices)

  const { okMI, nonOkMI, pendingMI } = filterFoundMI(serialNumbers, candidates)

  const inverter = [...okMI, ...nonOkMI, ...pendingMI]
  const expected = length(serialNumbers)
  const okMICount = length(okMI)
  const errMICount = length(nonOkMI)

  const [modalSN, setModalSN] = useState('')
  const [modalErrorMsg, setModalErrorMsg] = useState('PING_ERROR')

  const modalTitle = (
    <span className="has-text-white has-text-weight-bold">
      {t('MI_STATUS', modalSN)}
    </span>
  )

  const modalContent = (
    <span className="has-text-white has-text-centered">{t(modalErrorMsg)}</span>
  )

  const { modal, toggleModal } = useModal(modalContent, modalTitle, false)

  const showMIStatusModal = (serialNumber, errorMsg) => {
    setModalSN(serialNumber)
    setModalErrorMsg(errorMsg)
    toggleModal()
  }

  useEffect(() => {
    dispatch(FETCH_CANDIDATES_INIT())
  }, [dispatch])

  useEffect(() => {
    if (expected === okMICount + errMICount) {
      dispatch(FETCH_CANDIDATES_COMPLETE())
    }
  }, [errMICount, expected, okMICount, dispatch])

  useEffect(() => {
    //TODO: Remove duplicate Fetch Devices List when newest FW is rolled out
    if (claimedDevices) {
      dispatch(FETCH_DEVICES_LIST())
      dispatch(FETCH_DEVICES_LIST())
      history.push(paths.PROTECTED.MODEL_EDIT.path)
    }
  }, [claimedDevices, dispatch, history])

  const cleanAndGoBack = () => {
    dispatch(RESET_DISCOVERY())
    dispatch(SAVE_OK_MI(okMI))
    dispatch(DISCOVER_COMPLETE())
    history.push(paths.PROTECTED.SN_LIST.path)
  }

  const retryDiscovery = () => {
    const snList = serialNumbers.map(device => ({
      DEVICE_TYPE: 'Inverter',
      SERIAL: device.serial_number
    }))

    dispatch(RESET_DISCOVERY())
    dispatch(DISCOVER_COMPLETE())
    dispatch(PUSH_CANDIDATES_INIT(snList))
  }

  const claimDevices = () => {
    dispatch(DISCOVER_COMPLETE())
    const claimObject = inverter.map(mi => {
      mi.OPERATION = 'add'
      return mi
    })
    dispatch(CLAIM_DEVICES_INIT(claimObject))
  }

  return (
    <div className="fill-parent is-flex tile is-vertical has-text-centered sunpower-devices pr-15 pl-15">
      {modal}
      <span className="is-uppercase has-text-weight-bold mb-20" role="button">
        {t('DEVICES')}
      </span>
      <div className="pb-15">
        <Collapsible
          title={t('MICROINVERTERS')}
          icon={microInverterIcon}
          expanded
          actions={miActions(okMICount, length(inverter), 'sp-gear')}
        >
          <ul className="equipment-list">
            {inverter.map(elem => {
              const { serial_number, MODEL, STATEDESCR, indicator } = elem

              return (
                <li
                  className="equipment-piece is-flex flow-wrap tile"
                  key={serial_number}
                >
                  <div className="is-flex is-vertical tile">
                    <span>
                      <span className="has-text-weight-bold has-text-white">
                        SN:
                      </span>
                      <span className="has-text-white">{serial_number}</span>
                      {either(
                        indicator === 'MI_OK',
                        <span className="has-text-weight-bold has-text-white ml-10">
                          {miTypes[MODEL] || ''}
                        </span>
                      )}
                    </span>
                    {!isEmpty(STATEDESCR) ? (
                      <span>{t(`MISTATE_${miStates[STATEDESCR]}`)}</span>
                    ) : (
                      <span>{t('STATUS_PENDING')}</span>
                    )}
                  </div>
                  <div
                    className="is-flex mi-indicator"
                    onClick={() =>
                      showMIStatusModal(serial_number, t(STATEDESCR))
                    }
                  >
                    {miIndicators[indicator]}
                  </div>
                </li>
              )
            })}
          </ul>
        </Collapsible>
        <ProgressIndicators progressList={pathOr([], ['progress'], progress)} />
      </div>
      <DiscoveryStatus
        error={error}
        expected={expected}
        okMICount={okMICount}
        errMICount={errMICount}
        claimError={claimError}
        claimingDevices={claimingDevices}
        claimDevices={claimDevices}
        claimProgress={claimProgress}
        discoveryComplete={discoveryComplete}
        cleanAndGoBack={cleanAndGoBack}
        retryDiscovery={retryDiscovery}
      />
    </div>
  )
}

export default Devices
