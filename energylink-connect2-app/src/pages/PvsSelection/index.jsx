import React from 'react'
import { compose, map, path, pathOr, pick, uniqBy, prop } from 'ramda'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import paths from 'routes/paths'
import { useI18n } from 'shared/i18n'
import { useShowModal } from 'hooks/useGlobalModal'
import { RMA_SELECT_PVS } from 'state/actions/rma'

import './PVSelection.scss'

const getPvsSerialNumbers = compose(
  map(pick(['deviceSerialNumber', 'assignmentEffectiveTimestamp'])),
  uniqBy(prop('deviceSerialNumber')),
  pathOr([], ['site', 'sitePVS'])
)

function PvsSelection() {
  const PVS = useSelector(getPvsSerialNumbers)
  const history = useHistory()
  const dispatch = useDispatch()
  const t = useI18n()

  const showNoPVSSelected = useShowModal({
    title: '',
    dismissable: true
  })

  const PVSSelected = useSelector(path(['rma', 'pvs']))

  const shouldMoveNewRoute = route => {
    if (PVSSelected) history.push(route)
    else showNoPVSSelected({ body: t('SELECT_PVS_MODAL') })
  }

  return (
    <main className="full-height pl-10 pr-10 pvs-selection-screen">
      <section className="select-pvs-section">
        <span className="is-uppercase has-text-weight-bold mb-20 select-pvs-title">
          {t('SELECT_PVS')}
        </span>
        {PVS.map(elem => {
          const { deviceSerialNumber, assignmentEffectiveTimestamp } = elem
          return (
            <div
              key={deviceSerialNumber}
              onClick={() => dispatch(RMA_SELECT_PVS(deviceSerialNumber))}
              className={clsx(
                { 'label-selected': deviceSerialNumber === PVSSelected },
                'mb-10 label'
              )}
            >
              <span className="has-text-weight-bold">{deviceSerialNumber}</span>
              <p>
                {t(
                  'FIRST_CONNECTION',
                  moment(assignmentEffectiveTimestamp).format('MM/DD/YYYY')
                )}
              </p>
            </div>
          )
        })}
        <div
          className="new-pvs"
          onClick={() => history.push(paths.PROTECTED.INVENTORY_COUNT.path)}
        >
          <span className="mr-20 is-size-4 has-text-weight-bold sp-plus" />
          <span>{t('ADD_NEW_PVS')}</span>
        </div>
      </section>
      <section className="pvs-buttons mb-20">
        <button
          className="button has-text-centered is-uppercase is-secondary pt-0 pb-0 pl-10 pr-10"
          onClick={() =>
            shouldMoveNewRoute(paths.PROTECTED.CONNECT_TO_PVS.path)
          }
        >
          {t('REPLACE_PVS')}
        </button>
        <button
          className="button has-text-centered is-uppercase is-secondary pt-0 pb-0 pl-10 pr-10"
          onClick={() =>
            shouldMoveNewRoute(paths.PROTECTED.INVENTORY_COUNT.path)
          }
        >
          {t('EDIT_DEVICES')}
        </button>
      </section>
    </main>
  )
}

export default PvsSelection
