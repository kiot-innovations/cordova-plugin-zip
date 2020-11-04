import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { filter, head, length, pathOr } from 'ramda'

import { useI18n } from 'shared/i18n'
import { DATA_SOURCES, GRAPHS, SELECT_ENERGY_GRAPH } from 'state/actions/user'
import EnergyGraph, { VIEWS } from 'components/EnergyGraph'
import EnergySwitch from 'components/EnergySwitch'

import './EnergyGraphSection.scss'

const SelectedGraph = ({ selectedId, data, dataSource }) => {
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
  const lastDataPoint = dataEntries.length
    ? dataEntries[dataEntries.length - 1][1]
    : {
        pp: 0,
        pc: 0
      }

  return (
    <React.Fragment>
      {dataSource === DATA_SOURCES.LIVE ? (
        <div className="graph-top-values mt-20">
          <div className="prod ml-10">
            <div>
              {lastDataPoint.pp}
              <span className="unit"> kW</span>
            </div>
            <div>produced</div>
          </div>
          <div className="cons mr-10">
            <div>
              {lastDataPoint.pc}
              <span className="unit"> kW</span>
            </div>
            <div>consumed</div>
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
