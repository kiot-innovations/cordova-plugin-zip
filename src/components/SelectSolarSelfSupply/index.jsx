import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ModalSelect from '../ModalSelect'
import { useI18n } from '../../shared/i18n'
import { setSolarSelfSupply } from '../../state/actions/storage'

const createSelfSupplyChangeHandler = dispatch => {
  return option => dispatch(setSolarSelfSupply(option.id))
}

const SelectSolarSelfSupply = ({ disabled }) => {
  const t = useI18n()
  const dispatch = useDispatch()
  const selectedId = useSelector(
    state => state.storage && state.storage.selectedSolarSelfSupplyId
  )
  const options = [
    { id: 1, text: t('ZERO_BACKUP_SOLAR'), textLeft: '0%', value: 0 },
    { id: 2, text: t('TEN_BACKUP_SOLAR'), textLeft: '10%', value: 1 },
    { id: 3, text: t('TWENTY_BACKUP_SOLAR'), textLeft: '20%', value: 2 },
    { id: 4, text: t('THIRTY_BACKUP_SOLAR'), textLeft: '30%', value: 3 },
    { id: 5, text: t('FORTY_BACKUP_SOLAR'), textLeft: '40%', value: 4 },
    { id: 6, text: t('FIFTY_BACKUP_SOLAR'), textLeft: '50%', value: 5 }
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
      onClick={createSelfSupplyChangeHandler(dispatch)}
      modalId="modal-solar-self-supply-root"
      disabled={disabled}
    />
  )
}

export default SelectSolarSelfSupply
