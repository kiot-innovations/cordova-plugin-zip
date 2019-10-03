import React from 'react'
import clsx from 'clsx'
import { useI18n } from '../../shared/i18n'
import RadioButton from '../../components/RadioButton'
import SwitchButton from '../../components/SwitchButton'
import SelectSolarSelfSupply from '../../components/SelectSolarSelfSupply'
import { OPERATION_MODES } from '../../state/actions/storage'

export default ({ batteryMode, onChange }) => {
  const t = useI18n()
  const isChecked = batteryMode === OPERATION_MODES.STORAGE_SOLAR_SELF_SUPPLY
  const classes = clsx('info', { enabled: isChecked })
  return (
    <div className="subsection columns is-mobile is-multiline">
      <div className="column is-full">
        <div className="columns radio-button-controls is-mobile is-variable is-1">
          <div className="column is-half">
            <RadioButton
              id="solarSelfSupply"
              input={{ name: 'battery-mode', checked: isChecked, onChange }}
              text={t('SOLAR_SELF_SUPPLY')}
              value={OPERATION_MODES.STORAGE_SOLAR_SELF_SUPPLY}
            />
          </div>
          <div className="column flex is-half">
            <SwitchButton text="Set as default" />
          </div>
        </div>
      </div>
      <div className="column is-full">
        <p className={classes}>{t('SOLAR_SELF_SUPPLY_INFO')}</p>
      </div>
      <div className="column is-full">
        <h6 className="title is-6">{t('CHOOSE_BACKUP_RESERVE_AMOUNT')}</h6>
      </div>
      <div className="column is-full">
        <SelectSolarSelfSupply disabled={!isChecked} />
      </div>
    </div>
  )
}
