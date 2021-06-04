import React from 'react'
import { useI18n } from 'shared/i18n'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { RESET_COMPONENT_MAPPING } from 'state/actions/storage'
import { pathOr, isEmpty, length } from 'ramda'
import { either, warningsLength, withoutInfoCodes } from 'shared/utils'
import paths from 'routes/paths'
import ErrorDetected from 'components/ESSErrorDetected'
import './ESSDeviceMappingError.scss'

function DeviceMappingError() {
  const t = useI18n()
  const history = useHistory()
  const dispatch = useDispatch()
  const { componentMapping } = useSelector(pathOr({}, ['storage']))
  const errors = pathOr([], ['errors'], componentMapping)

  const noInfo = withoutInfoCodes(errors)
  const warningsCount = warningsLength(noInfo)
  const errorsDetected = length(noInfo) - warningsCount

  const retryMapping = () => {
    dispatch(RESET_COMPONENT_MAPPING())
    history.push(paths.PROTECTED.ESS_DEVICE_MAPPING.path)
  }

  return (
    <section className="ess-device-mapping-error is-flex tile is-vertical pt-0 pr-10 pl-10 full-height">
      <h1 className="has-text-centered is-uppercase pb-20">
        {t('DEVICE_MAPPING')}
      </h1>

      <div className="main-container">
        <div className="pt-20 pb-20">
          <span className="sp-close is-size-1 has-text-white" />
        </div>
        <div>{t('DEVICE_MAPPING_ERROR')}</div>
      </div>

      {either(
        isEmpty(noInfo),
        <div className="has-text-centered">
          <div className="has-text-centered pr-20 pl-20">
            {t('DEVICE_MAPPING_ERROR_ADVICE')}
          </div>
          <div className="are-small mt-20">
            <button
              className="button auto is-uppercase is-secondary"
              onClick={retryMapping}
            >
              {t('RETRY')}
            </button>
          </div>
        </div>,
        <ErrorDetected
          number={errorsDetected}
          warnings={warningsCount}
          onRetry={retryMapping}
          url={paths.PROTECTED.ESS_DEVICE_MAPPING_ERROR_LIST.path}
          next={paths.PROTECTED.ESS_DEVICE_MAPPING_ERROR_LIST.path}
        />
      )}
    </section>
  )
}

export default DeviceMappingError
