import React from 'react'
import clsx from 'clsx'
import { useI18n } from '../../shared/i18n'
import RadioButton from '../../components/RadioButton'
import SelectCostSaving from '../../components/SelectCostSaving'
import { OPERATION_MODES } from '../../state/actions/storage'

export default ({ batteryMode, onChange }) => {
  const t = useI18n()
  const isChecked = batteryMode === OPERATION_MODES.STORAGE_COST_SAVING
  const classes = clsx('info', { enabled: isChecked })
  return (
    <div className="subsection columns is-mobile is-multiline is-variable is-1">
      <div className="column is-full">
        <RadioButton
          id="cost-saving"
          input={{ name: 'battery-mode', checked: isChecked, onChange }}
          text={t('COST_SAVINGS')}
          value={OPERATION_MODES.STORAGE_COST_SAVING}
        />
      </div>
      <div className="column is-full">
        <p className={classes}>{t('COST_SAVING_HELP')}</p>
      </div>
      <div className="column is-full">
        <h6 className="title is-6">{t('CHOOSE_BACKUP_RESERVE_AMOUNT')}</h6>
      </div>
      <div className="column is-full">
        <SelectCostSaving disabled={!isChecked} />
      </div>
    </div>
  )
}
