import React, { useEffect, useState } from 'react'
import { compose, prop, pathOr, equals, propEq } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { GET_RSE_INIT, SET_RSE_INIT } from 'state/actions/systemConfiguration'

import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'
import { Loader } from 'components/Loader'

const RSE = <span className="sp-power file level mr-15 is-size-4" />

function RSEWidget({ animationState }) {
  const t = useI18n()
  const dispatch = useDispatch()

  const isFetching = useSelector(
    pathOr(false, ['systemConfiguration', 'rse', 'isFetching'])
  )

  const isSetting = useSelector(
    pathOr(false, ['systemConfiguration', 'rse', 'isSetting'])
  )

  const { powerProduction = 'Off', progress = '20%' } = useSelector(
    pathOr({}, ['systemConfiguration', 'rse', 'data'])
  )

  const [rseValue, setRSEValue] = useState(powerProduction)

  useEffect(() => {
    if (animationState === 'enter') dispatch(GET_RSE_INIT())
  }, [animationState, dispatch])

  useEffect(() => {
    setRSEValue(powerProduction)
  }, [powerProduction])

  const RSES = [
    { label: t('ON'), value: 'On' },
    { label: t('OFF'), value: 'Off' }
  ]

  const allowSetRSEValue = equals(powerProduction, rseValue)
  const showProgress = isSetting && progress < 100
  const currentRSEValue = RSES.find(propEq('value', rseValue))
  const sendNewRSEValue = compose(dispatch, SET_RSE_INIT)

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
                      disabled={isSetting || progress < 100}
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

            <div className="is-flex mt-15">
              <button
                className="button is-primary auto"
                disabled={allowSetRSEValue || isSetting}
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
