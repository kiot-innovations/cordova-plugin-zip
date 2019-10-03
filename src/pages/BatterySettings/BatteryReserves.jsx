import React from 'react'
import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import { useI18n } from '../../shared/i18n'
import SelectReservesTimer from '../../components/SelectReservesTimer'
import RadioButton from '../../components/RadioButton'
import { OPERATION_MODES, startBackup } from '../../state/actions/storage'

const createStartBackupClickHandler = dispatch => () => dispatch(startBackup())

export default ({ batteryMode, onChange }) => {
  const t = useI18n()
  const isChecked = batteryMode === OPERATION_MODES.STORAGE_BACKUP_ONLY
  const dispatch = useDispatch()
  const classes = clsx('info', { enabled: isChecked })
  return (
    <div className="subsection columns is-mobile is-multiline is-variable is-1">
      <div className="column is-full">
        <RadioButton
          id="backup"
          input={{ name: 'battery-mode', checked: isChecked, onChange }}
          text={t('BACKUP_ONLY')}
          value={OPERATION_MODES.STORAGE_BACKUP_ONLY}
        />
      </div>
      <div className="column is-full">
        <p className={classes}>{t('BACKUP_ONLY_INFO')}</p>
      </div>
      <div className="column is-full">
        <h6 className="title is-6">{t('BACKUP_ONLY_SELECT_LABEL')}</h6>
      </div>
      <div className="column is-6">
        <SelectReservesTimer disabled={!isChecked} />
      </div>
      <div className="column is-6">
        <button
          className="button start-back-up is-primary is-uppercase"
          onClick={createStartBackupClickHandler(dispatch)}
          type="submit"
          disabled={!isChecked}
        >
          {t('BTN_START_BK')}
        </button>
      </div>
    </div>
  )
}
