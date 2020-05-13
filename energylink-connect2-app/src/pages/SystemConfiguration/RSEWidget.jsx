import Collapsible from 'components/Collapsible'
import SelectField from 'components/SelectField'
import { curry, compose, equals, pathOr, prop } from 'ramda'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { GET_RSE_INIT, SET_RSE_INIT } from 'state/actions/systemConfiguration'

const RSE = <span className="sp-power file level mr-15 is-size-4" />

const invertedPowerProduction = curry((RSES, pp) =>
  pp === RSES[0].value ? RSES[1] : RSES[0]
)

function RSEWidget() {
  const t = useI18n()
  const dispatch = useDispatch()

  const { isSetting, error, data = {} } = useSelector(
    pathOr({}, ['systemConfiguration', 'rse'])
  )

  const { powerProduction = 'Off', progress = 100 } = data

  const RSES = [
    { label: t('ON'), value: 'On' },
    { label: t('OFF'), value: 'Off' }
  ]

  const [rseValue, setRSEValue] = useState(powerProduction)

  const disableApplyBtn = !equals(powerProduction, rseValue)
  const sendNewRSEValue = compose(dispatch, SET_RSE_INIT)
  const onSelectRSE = compose(
    setRSEValue,
    prop('value'),
    invertedPowerProduction(RSES),
    prop('value')
  )

  useEffect(() => {
    dispatch(GET_RSE_INIT())
  }, [dispatch])

  useEffect(() => {
    setRSEValue(powerProduction)
  }, [powerProduction])

  return (
    <div className="pb-15">
      <Collapsible title={t('RSE')} icon={RSE}>
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
                    disabled={isSetting}
                    isSearchable={false}
                    options={RSES}
                    value={invertedPowerProduction(RSES, rseValue)}
                    onSelect={onSelectRSE}
                  />
                </div>
              </div>
            </div>
          </div>

          {renderRSEDescription(
            invertedPowerProduction(RSES, rseValue).value,
            t
          )}

          {either(
            error,
            <div className="message error mt-10 mb-10">{t(error)}</div>
          )}

          <div className="is-flex mt-15">
            <button
              className="button is-primary auto"
              disabled={isSetting || disableApplyBtn}
              onClick={() =>
                sendNewRSEValue(invertedPowerProduction(RSES, rseValue).value)
              }
            >
              {either(
                isSetting,
                t(
                  'APPLYING',
                  progress && progress < 100 ? `${progress}%` : '...'
                ),
                t('SET', invertedPowerProduction(RSES, powerProduction).value)
              )}
            </button>
          </div>
        </React.Fragment>
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
