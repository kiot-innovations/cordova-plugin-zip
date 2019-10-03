import React from 'react'
import clsx from 'clsx'
import { useSelector, useDispatch } from 'react-redux'
import ModalLayout from '../../components/ModalLayout'
import { useI18n } from '../../shared/i18n'
import { setOperationMode } from '../../state/actions/storage'
import BatteryReserves from './BatteryReserves'
import CostSaving from './CostSaving'
import SelfSupply from './SelfSupply'
import './BatterySettings.scss'

const createBatteryModeHandler = dispatch => event => {
  dispatch(setOperationMode(event.currentTarget.value))
}

const BatterySettings = ({ history, location, className }) => {
  const classes = clsx('battery-settings-modal', className)
  const t = useI18n()
  const dispatch = useDispatch()

  const batteryMode = useSelector(state => state.storage.selectedMode)
  const changeHandler = createBatteryModeHandler(dispatch)
  return (
    <ModalLayout
      className={classes}
      history={history}
      title={t('BATTERY_SETTINGS')}
      from={location && location.state && location.state.from}
      hasBackButton
    >
      <BatteryReserves batteryMode={batteryMode} onChange={changeHandler} />
      <div className="separator is-solid is-gray is-full-width" />
      <CostSaving batteryMode={batteryMode} onChange={changeHandler} />
      <div className="separator is-solid is-gray is-full-width" />
      <SelfSupply batteryMode={batteryMode} onChange={changeHandler} />
    </ModalLayout>
  )
}

export default BatterySettings
