import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { useI18n } from '../../shared/i18n'
import { GRAPHS, SELECT_ENERGY_GRAPH } from '../../state/actions/user'
import EnergyGraph, { VIEWS } from '../../components/EnergyGraph'
import EnergySwitch from '../../components/EnergySwitch'
import { INTERVALS } from '../../state/actions/energy-data'
import SocialShareButton from '../../components/SocialShareButton'
import { convertToCanvas } from '../../state/actions/share'
import { sliceData } from '../../shared/sliceData'

const getSelectedGraph = (selectedId, data) => {
  if (selectedId === GRAPHS.ENERGY) {
    return (
      <EnergyGraph
        hasStorage={true}
        data={data}
        weather={true}
        view={VIEWS.DAY}
      />
    )
  }

  return (
    <EnergyGraph
      className="power-graph"
      series={['pp', 'pc', 'ps']}
      unitLabel="kW"
      hasStorage={true}
      power={true}
      data={data}
      weather={true}
      view={VIEWS.DAY}
    />
  )
}

const getStartTime = data => {
  const dates = Object.keys(data)
  const firstEntryDate = dates.length > 0 ? dates.pop() : moment()
  return moment(firstEntryDate)
    .startOf('hour')
    .format('hh:mmA')
}

const convertToCanvasOptions = {
  onCloneElement: document => {
    const graphContainer = document.getElementsByClassName(
      'energy-graph-column'
    )[0]
    graphContainer.style.marginTop = '-80px'
  },
  heightOffset: -80
}

const shareId = 'energy-graph'

export default function EnergyGraphSection() {
  const t = useI18n()
  const dispatch = useDispatch()
  const data = useSelector(state => {
    const data =
      state.energyData[INTERVALS.HOUR] && state.energyData[INTERVALS.HOUR].data
    const dateKeys = Object.keys(data)

    if (!dateKeys.length) {
      return {}
    }

    return sliceData(data, moment().startOf('day'), moment().endOf('day')).data
  })
  const selectedId = useSelector(state => state.global.selectedEnergyGraph)
  const graphSelect = [
    { id: GRAPHS.ENERGY, value: `${t('ENERGY')} (kWh)` },
    { id: GRAPHS.POWER, value: `${t('POWER')} (kW)` }
  ].map(entry =>
    entry.id === selectedId ? { ...entry, selected: true } : entry
  )

  return (
    <div
      id={shareId}
      className="energy-graph-container columns is-mobile is-multiline is-variable is-1"
    >
      <div className="column is-8">
        <h6 className="title is-uppercase is-6">{t('ENERGY_POWER_GRAPH')}</h6>
        <h6 className="subtitle is-uppercase is-6">
          {t('AS_OF_TIME_TODAY', getStartTime(data))}
        </h6>
      </div>
      <div className="column is-4 is-flex icons ignore-in-share">
        <SocialShareButton
          beforeShare={() =>
            dispatch(convertToCanvas(shareId, convertToCanvasOptions))
          }
        />
      </div>
      <div className="column is-full ignore-in-share pb-0">
        <EnergySwitch
          entries={graphSelect}
          onChange={id => dispatch(SELECT_ENERGY_GRAPH(id))}
        />
      </div>
      <div className="column energy-graph-column is-full pt-0">
        {getSelectedGraph(selectedId, data)}
      </div>
    </div>
  )
}
