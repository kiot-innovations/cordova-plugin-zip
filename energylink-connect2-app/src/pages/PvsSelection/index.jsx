import React, { useEffect, useState } from 'react'
import { compose, map, path, pathOr, pick, uniqBy, prop, isEmpty } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { useShowModal } from 'hooks/useGlobalModal'
import { rmaModes } from 'state/reducers/rma'
import {
  RMA_SELECT_PVS,
  SET_RMA_MODE,
  FETCH_DEVICE_TREE
} from 'state/actions/rma'
import { Loader } from 'components/Loader'
import './PVSelection.scss'

const getPvsSerialNumbers = compose(
  map(pick(['deviceSerialNumber', 'assignmentEffectiveTimestamp'])),
  uniqBy(prop('deviceSerialNumber')),
  pathOr([], ['site', 'sitePVS'])
)

function PvsSelection() {
  const PVS = useSelector(getPvsSerialNumbers)
  const { rmaMode, cloudDeviceTree } = useSelector(state => state.rma)
  const [fetchDevicesStatus, showFetchDevicesStatus] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const t = useI18n()

  useEffect(() => {
    if (rmaMode === rmaModes.REPLACE_PVS && !isEmpty(cloudDeviceTree.devices)) {
      history.push(paths.PROTECTED.RMA_EXISTING_DEVICES.path)
    }
  })

  const showNoPVSSelected = useShowModal({
    title: '',
    dismissable: true
  })

  const PVSSelected = useSelector(path(['rma', 'pvs']))

  const editDevices = () => {
    if (PVSSelected) {
      dispatch(SET_RMA_MODE(rmaModes.EDIT_DEVICES))
      history.push(paths.PROTECTED.CONNECT_TO_PVS.path)
    } else {
      showNoPVSSelected({ body: t('SELECT_PVS_MODAL') })
    }
  }

  const replacePVS = () => {
    if (PVSSelected) {
      showFetchDevicesStatus(true)
      dispatch(SET_RMA_MODE(rmaModes.REPLACE_PVS))
      dispatch(FETCH_DEVICE_TREE())
    } else {
      showNoPVSSelected({ body: t('SELECT_PVS_MODAL') })
    }
  }

  return (
    <main className="full-height pl-10 pr-10 pvs-selection-screen">
      <section className="select-pvs-section">
        <span className="is-uppercase has-text-weight-bold mb-20 select-pvs-title">
          {t('SELECT_PVS')}
        </span>
        {PVS.map(elem => {
          const { deviceSerialNumber, assignmentEffectiveTimestamp } = elem
          return (
            <div
              key={deviceSerialNumber}
              onClick={() => dispatch(RMA_SELECT_PVS(deviceSerialNumber))}
              className={clsx(
                { 'label-selected': deviceSerialNumber === PVSSelected },
                'mb-10 label'
              )}
            >
              <span className="has-text-weight-bold">{deviceSerialNumber}</span>
              <p>
                {t(
                  'FIRST_CONNECTION',
                  moment(assignmentEffectiveTimestamp).format('MM/DD/YYYY')
                )}
              </p>
            </div>
          )
        })}
        <div
          className="new-pvs"
          onClick={() => history.push(paths.PROTECTED.INVENTORY_COUNT.path)}
        >
          <span className="mr-20 is-size-4 has-text-weight-bold sp-plus" />
          <span>{t('ADD_NEW_PVS')}</span>
        </div>
      </section>
      <section className="pvs-buttons mb-20">
        <button
          className="button has-text-centered is-uppercase is-secondary is-fullwidth mr-5"
          onClick={replacePVS}
        >
          {t('REPLACE_PVS')}
        </button>
        <button
          className="button has-text-centered is-uppercase is-secondary is-fullwidth ml-5"
          onClick={editDevices}
        >
          {t('EDIT_DEVICES')}
        </button>
      </section>

      <SwipeableBottomSheet
        shadowTip={false}
        open={fetchDevicesStatus}
        onChange={() => showFetchDevicesStatus(!fetchDevicesStatus)}
      >
        <div className="fetch-devices-status is-flex">
          <span className="has-text-weight-bold has-text-white mb-40">
            {either(
              cloudDeviceTree.error,
              t('FETCH_DEVICETREE_ERROR'),
              t('FETCH_DEVICETREE_WAIT')
            )}
          </span>
          {either(
            cloudDeviceTree.fetching,
            <Loader />,
            <div>
              <button className="button is-primary mb-20" onClick={replacePVS}>
                {t('TRY_AGAIN')}
              </button>
            </div>
          )}
        </div>
      </SwipeableBottomSheet>
    </main>
  )
}

export default PvsSelection
