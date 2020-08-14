import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { prop } from 'ramda'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { PLT_SAVE } from 'state/actions/panel-layout-tool'
import { Loader } from 'components/Loader'

const PanelLayoutToolSavingStatus = () => {
  const { saved, error, saving } = useSelector(prop('pltWizard'))
  const t = useI18n()
  const dispatch = useDispatch()

  return (
    <div className="plt-status is-flex is-vertical tile">
      {either(saved, t('PLT_SAVED'))}
      {either(
        error,
        <>
          <span className="has-text-weight-bold">{t('PLT_SAVE_ERROR')}</span>

          <div className="pt-20 pb-20">
            <i className="sp-close has-text-white is-size-1" />
          </div>

          <button
            className="button is-secondary is-uppercase has-no-border"
            onClick={() => dispatch(PLT_SAVE())}
          >
            {t('RETRY')}
          </button>
        </>
      )}

      {either(
        saving,
        <>
          <span className="has-text-weight-bold">{t('PLT_SAVING')}</span>
          <Loader />
        </>
      )}
    </div>
  )
}

export default PanelLayoutToolSavingStatus
