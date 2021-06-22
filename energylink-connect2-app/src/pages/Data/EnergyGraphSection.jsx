import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filter, head, isNil, last, length, pathOr, propOr } from 'ramda'

import { useI18n } from 'shared/i18n'
import { DATA_SOURCES, GRAPHS, SELECT_ENERGY_GRAPH } from 'state/actions/user'
import EnergyGraph, { VIEWS } from 'components/EnergyGraph'
import EnergySwitch from 'components/EnergySwitch'

import './EnergyGraphSection.scss'
import { roundDecimals } from '../../shared/rounding'

const SelectedGraph = ({ selectedId, data, dataSource }) => {
  const t = useI18n()
  const inventory = useSelector(pathOr({}, ['inventory', 'bom']))
  const storageInventory = inventoryItem => inventoryItem.item === 'ESS'
  const storage = filter(storageInventory, inventory)
  const hasStorage = length(storage) ? head(storage).value !== '0' : false

  if (selectedId === GRAPHS.ENERGY) {
    return (
      <EnergyGraph
        className="mt-55"
        hasStorage={hasStorage}
        data={data}
        weather={true}
        view={VIEWS.LIVE}
        animation={false}
      />
    )
  }

  const dataEntries = Object.entries(data)
  const lastDataPoint =
    length(dataEntries) > 0
      ? last(dataEntries)[1]
      : {
          pp: 0,
          pc: 0,
          ps: 0
        }

  const produced = propOr(0, 'pp', lastDataPoint)
  const rawConsumed = roundDecimals(
    pathOr(0, ['rawData', 'site_load_p'], lastDataPoint)
  )
  const consumed = isNil(lastDataPoint.pc) ? rawConsumed : lastDataPoint.pc

  return (
    <React.Fragment>
      {dataSource === DATA_SOURCES.LIVE ? (
        <div className="graph-top-values mt-20">
          <div className="prod ml-10">
            <div>
              {produced}
              <span className="unit"> kW</span>
            </div>
            <div>{t('PRODUCED')}</div>
          </div>
          <div className="cons mr-10">
            <div>
              {consumed}
              <span className="unit"> kW</span>
            </div>
            <div>{t('CONSUMED')}</div>
          </div>
        </div>
      ) : (
        <div className="mt-55" />
      )}
      <EnergyGraph
        className="power-graph"
        series={['pp', 'pc', 'ps']}
        unitLabel="kW"
        hasStorage={hasStorage}
        power={true}
        data={data}
        weather={true}
        view={VIEWS.LIVE}
        animation={false}
      />
    </React.Fragment>
  )
}

const shareId = 'energy-graph'

export default function EnergyGraphSection() {
  const t = useI18n()
  const dispatch = useDispatch()

  const selectedId = useSelector(state => state.global.selectedEnergyGraph)
  const selectedDataSourceId = useSelector(
    state => state.global.selectedDataSource
  )

  const data = useSelector(state => state.energyLiveData.liveData)

  const graphSelect = [
    { id: GRAPHS.POWER, value: `${t('POWER')} (kW)` },
    { id: GRAPHS.ENERGY, value: `${t('ENERGY')} (kWh)` }
  ].map(entry =>
    entry.id === selectedId ? { ...entry, selected: true } : entry
  )

  return (
    <div
      id={shareId}
      className="energy-graph-container columns is-mobile is-multiline is-variable is-1"
    >
      <div className="column is-full ignore-in-share pb-0">
        <EnergySwitch
          entries={graphSelect}
          onChange={id => dispatch(SELECT_ENERGY_GRAPH(id))}
        />
      </div>
      <div className="column energy-graph-column is-full pt-0">
        <SelectedGraph
          selectedId={selectedId}
          data={data}
          dataSource={selectedDataSourceId}
        />
      </div>
    </div>
  )
}
