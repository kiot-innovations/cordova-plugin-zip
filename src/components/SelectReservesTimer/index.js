import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ModalSelect from '../ModalSelect'
import { useI18n } from '../../shared/i18n'
import { setBackupMaxDays } from '../../state/actions/storage'

const createBackupTimerChangeHandler = dispatch => {
  return option => dispatch(setBackupMaxDays(option.id))
}

const SelectReservesTimer = ({ disabled }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const selectedId = useSelector(
    state => state.storage && state.storage.selectedBatteryReserves
  )
  const options = [
    { id: 1, text: t('ONE_DAY'), value: 0 },
    { id: 2, text: t('TWO_DAYS'), value: 1 },
    { id: 3, text: t('THREE_DAYS'), value: 2 },
    { id: 4, text: t('FOUR_DAYS'), value: 3 },
    { id: 5, text: t('FIVE_DAYS'), value: 4 }
  ]
  const selectedOpt = options.find(({ id }) => id === selectedId) || {}
  selectedOpt.selected = true
  const footer = (
    <div className="backup-warning pr-20 pl-20 mb-30">
      <span>{t('BATTERY_RESERVE_WARNING_1')}</span>
      <span className="highlighted">{t('BATTERY_RESERVE_WARNING_2')}</span>
      <span>{t('BATTERY_RESERVE_WARNING_3')}</span>
    </div>
  )
  return (
    <ModalSelect
      header={t('CHOOSE_BACKUP_RESERVE_AMOUNT')}
      options={options}
      className="cost-savings is-seven-eighths"
      footer={footer}
      onClick={createBackupTimerChangeHandler(dispatch)}
      modalId="modal-reserves-timer"
      disabled={disabled}
    />
  )
}

export default SelectReservesTimer
