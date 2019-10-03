import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ModalSelect from '../ModalSelect'
import { useI18n } from '../../shared/i18n'
import { setCostSaving } from '../../state/actions/storage'

const createCostSavingChangeHandler = dispatch => {
  return option => dispatch(setCostSaving(option.id))
}

const SelectCostSaving = ({ disabled }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const selectedId = useSelector(
    state => state.storage && state.storage.selectedCostSavingId
  )
  const options = [
    { id: 1, text: t('ZERO_BACKUP'), textLeft: '0%', value: 0 },
    { id: 2, text: t('TEN_BACKUP'), textLeft: '10%', value: 2 },
    { id: 3, text: t('TWENTY_BACKUP'), textLeft: '20%', value: 4 },
    { id: 4, text: t('THIRTY_BACKUP'), textLeft: '30%', value: 6 },
    { id: 5, text: t('FORTY_BACKUP'), textLeft: '40%', value: 8 },
    { id: 6, text: t('FIFTY_BACKUP'), textLeft: '50%', value: 10 }
  ]
  const selectedOpt = options.find(({ id }) => id === selectedId) || {}
  selectedOpt.selected = true
  const footer = (
    <div className="backup-warning pr-20 pl-20 mb-30">
      <span className="highlighted">{t('BACKUP_MAX')}</span>
      <span>{t('BACKUP_WARNING')}</span>
    </div>
  )
  return (
    <ModalSelect
      header={t('CHOOSE_BACKUP_RESERVE_AMOUNT')}
      options={options}
      className="cost-savings is-seven-eighths"
      footer={footer}
      onClick={createCostSavingChangeHandler(dispatch)}
      modalId="modal-cost-saving-root"
      disabled={disabled}
    />
  )
}

export default SelectCostSaving
