import Collapsible from 'components/Collapsible'
import { Loader } from 'components/Loader'
import SelectField from 'components/SelectField'
import { compose, equals, pathOr, prop, propEq } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import {
  GET_RSE_INIT,
  SET_RSE_INIT,
  SET_RSE_STATUS
} from 'state/actions/systemConfiguration'

const RSE = <span className="sp-power file level mr-15 is-size-4" />

function RSEWidget() {
  const t = useI18n()
  const dispatch = useDispatch()

  const { isFetching, isPolling, isSetting, error, data = {} } = useSelector(
    pathOr({}, ['systemConfiguration', 'rse'])
  )

  const { powerProduction = 'Off', progress } = data

  const [rseValue, setRSEValue] = useState(powerProduction)

  const disableSetRSEValue = equals(powerProduction, rseValue) || isSetting
  const disableSelectValue = isSetting && isPolling
  const showProgress = isSetting && progress < 100

  const RSES = [
    { label: t('ON'), value: 'On' },
    { label: t('OFF'), value: 'Off' }
  ]

  const currentRSEValue = RSES.find(propEq('value', rseValue))
  const sendNewRSEValue = compose(dispatch, SET_RSE_INIT)

  useEffect(() => {
    dispatch(GET_RSE_INIT())
    // we sent the command, closed the page and came back,
    // we need to start polling to check its status
    if (progress && progress < 100 && !isPolling) dispatch(SET_RSE_STATUS())
  }, [dispatch, isPolling, progress])

  useEffect(() => {
    setRSEValue(powerProduction)
  }, [powerProduction])

  return (
    <div className="pb-15">
      <Collapsible title={t('RSE')} icon={RSE}>
        {either(
          isFetching,
          <Loader />,
          <React.Fragment>
            <div className="field is-horizontal mb-15">
              <div className="field-label">
                <label htmlFor="siteName" className="label has-text-white">
                  {t('REMOTE_SYSTEM_ENERGYZE')}
                </label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control">
                    <SelectField
                      disabled={disableSelectValue}
                      isSearchable={false}
                      options={RSES}
                      value={currentRSEValue}
                      onSelect={compose(setRSEValue, prop('value'))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {renderRSEDescription(powerProduction, t)}

            {either(
              error,
              <div className="message error mt-10 mb-10">{t(error)}</div>
            )}

            <div className="is-flex mt-15">
              <button
                className="button is-primary auto"
                disabled={disableSetRSEValue}
                onClick={() => sendNewRSEValue(rseValue)}
              >
                {either(isSetting, t('APPLYING'), t('APPLY'))}

                {either(
                  showProgress,
                  <span className="ml-10 has-text-information">
                    {progress}%
                  </span>
                )}
              </button>
            </div>
          </React.Fragment>
        )}
      </Collapsible>
    </div>
  )
}

const renderRSEDescription = (powerProduction, t) =>
  either(
    equals(powerProduction, 'On'),
    <article>
      <p className="text-center">{t('RSE_ON_SYSTEM')}</p>
      <ul>
        <li>{t('RSE_ON_1')}</li>
        <li>{t('RSE_ON_2')}</li>
      </ul>

      <p className="text-center mt-10">{t('RSE_ON_INVERTERS')}</p>
      <ul>
        <li>{t('RSE_ON_3')}</li>
        <li>{t('RSE_ON_4')}</li>
      </ul>
    </article>,
    <p className="text-center">{t('RSE_OFF')}</p>
  )

export default RSEWidget
