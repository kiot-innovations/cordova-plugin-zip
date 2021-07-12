import clsx from 'clsx'
import { isEmpty, pathOr } from 'ramda'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Collapsible from 'components/Collapsible'
import { useI18n } from 'shared/i18n'
import { either } from 'shared/utils'
import { GET_STORAGE_INIT } from 'state/actions/systemConfiguration'

const STI = <span className="sp-battery file level mr-15 is-size-4" />

function StorageWidget() {
  const t = useI18n()
  const dispatch = useDispatch()

  const storageSystems = useSelector(
    pathOr(
      [],
      ['systemConfiguration', 'storage', 'data', 'energyStorageSystems']
    )
  )

  const error = useSelector(
    pathOr(null, ['systemConfiguration', 'storage', 'error'])
  )

  useEffect(() => {
    dispatch(GET_STORAGE_INIT())
  }, [dispatch])

  const noStorage = isEmpty(storageSystems) && error

  return (
    <div className="pb-15">
      <Collapsible
        title={t('STORAGE')}
        icon={STI}
        className={clsx({ 'is-flex': noStorage })}
      >
        {either(
          noStorage,
          renderEmpty(t),
          storageSystems.map(renderStorageSystem(t))
        )}
      </Collapsible>
    </div>
  )
}

const renderStorageSystem = t => ({ batteries, inverter }) => (
  <section className="box is-flex space-around has-background-black has-text-grey pl-10 pr-10">
    <article>
      <h6 className="is-size-5 has-text-white is-lowercase">
        {batteries.length} {t('BATTERIES')}
      </h6>
      <ul>
        {batteries.map(({ serialNumber }) => (
          <li>{serialNumber}</li>
        ))}
      </ul>
    </article>

    <article>
      <h6 className="is-size-5 has-text-white">{t('INVERTER')}</h6>
      <ul>
        <li>{inverter.serialNumber}</li>
      </ul>

      <h6 className="is-size-5 has-text-white mt-20">
        {t('INVERTER_GATEWAY')}
      </h6>
      <ul>
        <li>{t('INSTALLED')}</li>
      </ul>
    </article>
  </section>
)

const renderEmpty = t => (
  <div className="auto pl-30 pr-30">
    <p className="has-text-centered empty is-size-4">
      {t('NO_STORAGE_INSTALLED')}
    </p>
  </div>
)

export default StorageWidget
