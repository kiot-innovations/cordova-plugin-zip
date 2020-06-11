import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filter, head, length, pathOr } from 'ramda'
import RightNow from 'components/RightNow'
import { useI18n } from 'shared/i18n'
import { roundDecimals } from 'shared/rounding'
import {
  ENERGY_DATA_START_POLLING,
  ENERGY_DATA_STOP_POLLING
} from 'state/actions/energy-data'
import { MI_DATA_START_POLLING, MI_DATA_STOP_POLLING } from 'state/actions/pvs'
import { either } from 'shared/utils'

import EnergyGraphSection from './EnergyGraphSection'
import MiDataLive from 'components/MiDataLive'

import './Data.scss'

export default () => {
  const t = useI18n()
  const dispatch = useDispatch()
  const { liveData = {} } = useSelector(state => state.energyLiveData)
  const { miData } = useSelector(state => state.pvs)

  const inventory = useSelector(pathOr({}, ['inventory', 'bom']))
  const storageInventory = inventoryItem => inventoryItem.item === 'ESS'
  const storage = filter(storageInventory, inventory)
  const hasStorage = length(storage) ? head(storage).value !== '0' : false

  useEffect(() => {
    dispatch(ENERGY_DATA_START_POLLING())
    dispatch(MI_DATA_START_POLLING())
    return () => {
      dispatch(ENERGY_DATA_STOP_POLLING())
      dispatch(MI_DATA_STOP_POLLING())
    }
  }, [dispatch])

  let data = {
    solar: 0,
    stateOfCharge: 0,
    storage: 0,
    grid: 0,
    date: new Date(),
    homeUsage: 0
  }

  const entries = Object.entries(liveData)

  if (entries.length) {
    const [latestDate, latest] = entries[entries.length - 1]
    data = {
      date: latestDate,
      stateOfCharge: latest.soc,
      solar: latest.p,
      storage: latest.s,
      homeUsage: latest.c,
      grid: roundDecimals(latest.c - latest.p - latest.s),
      powerSolar: latest.pp,
      powerStorage: latest.ps,
      powerHomeUsage: latest.pc,
      powerGrid: roundDecimals(latest.pc - latest.pp - latest.ps)
    }
  }

  return (
    <section className="data is-flex has-text-centered full-height">
      <section>
        <h6 className="is-uppercase mt-20 mb-20">{t('RIGHT_NOW')}</h6>
        <RightNow
          solarValue={data.powerSolar}
          gridValue={data.powerGrid}
          hasStorage={hasStorage}
          storageValue={data.powerStorage}
          homeValue={data.powerHomeUsage}
          batteryLevel={data.stateOfCharge}
        />
      </section>
      <div className="separator" />
      {either(miData, <MiDataLive data={miData} />)}
      <div className="separator" />
      <EnergyGraphSection />
    </section>
  )
}
