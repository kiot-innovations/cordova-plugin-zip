import { always, compose, equals, ifElse, is, pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { Client as WebSocket } from 'rpc-websockets'
import { Observable, of, iif } from 'rxjs'
import {
  catchError,
  delay,
  map,
  retryWhen,
  tap,
  exhaustMap
} from 'rxjs/operators'

import { roundDecimals } from 'shared/rounding'
import * as energyDataActions from 'state/actions/energy-data'
import { SET_PVS_MODEL } from 'state/actions/pvs'

const createWebsocketObservable = () =>
  new Observable(subscriber => {
    const ws = new WebSocket(process.env.REACT_APP_PVS_WS, {
      reconnect: false
    })

    ws.on('error', err => subscriber.error(err))

    ws.on('close', () => subscriber.error(new Error('Connection closed')))

    ws.on('open', () => {
      subscriber.next({ evt: 'open' })

      ws.on('power', data => subscriber.next({ evt: 'power', data }))

      return () => {
        ws.close()
      }
    })
  })

const getMeterConfig = pathOr('', [
  'value',
  'systemConfiguration',
  'meter',
  'consumptionCT'
])

const getLoadSideProduction = (state, energyProduction) =>
  compose(
    ifElse(
      equals('NET_CONSUMPTION_LOADSIDE'),
      always(energyProduction),
      always(0)
    ),
    getMeterConfig
  )(state)

export const liveEnergyData = (action$, state$) =>
  action$.pipe(
    ofType(SET_PVS_MODEL.getType()),
    exhaustMap(({ payload: pvsModel }) =>
      iif(
        () => pvsModel !== 'PVS5',
        createWebsocketObservable().pipe(
          retryWhen(errors =>
            errors.pipe(
              tap(err => console.error('Websocket connection', err)),
              delay(2000)
            )
          ),
          map(({ evt, data }) => {
            switch (evt) {
              case 'open':
                return energyDataActions.LIVE_ENERGY_DATA_CONNECTION(data)
              case 'close':
                return energyDataActions.LIVE_ENERGY_DATA_ERROR({
                  error: 'Connection closed'
                })
              case 'dailyPower':
                // eslint-disable-next-line no-case-declarations
                const diffData = {
                  soc: data.today[1] || 0,
                  net_en: (data.today[5] || 0) - (data.yesterday[5] || 0),
                  pv_en: (data.today[6] || 0) - (data.yesterday[6] || 0),
                  ess_en: (data.today[7] || 0) - (data.yesterday[7] || 0)
                }
                // eslint-disable-next-line no-case-declarations
                const loadSidePVEnergy = getLoadSideProduction(
                  state$,
                  diffData.pv_en
                )

                return energyDataActions.LIVE_ENERGY_DATA_DAILY({
                  soc: diffData.soc,
                  p: diffData.pv_en,
                  s: diffData.ess_en,
                  c: loadSidePVEnergy + diffData.ess_en + diffData.net_en
                })
              case 'power':
              default: {
                const {
                  pv_p = 0,
                  ess_p = 0,
                  net_p = 0, // net_p :: grid power (kW)
                  site_load_p = 0,
                  pv_en = 0,
                  net_en = 0, // net_en :: grid energy (kWh)
                  site_load_en = 0,
                  ess_en = 0
                } = data

                // powerProduction/pv_p :: power production (kW)

                const netPower =
                  site_load_p !== 0 ? site_load_p : net_p + pv_p + ess_p
                const netEnergy =
                  site_load_en !== 0 ? site_load_en : net_en + pv_en + ess_en

                const powerProduction = pv_p < 0.01 ? 0 : pv_p
                // energyStoragePower/ess_p :: energy storage power (kW)
                const energyStoragePower = Math.abs(ess_p) < 0.01 ? 0 : ess_p

                // powerConsumption :: power consumption (kW)
                const powerConsumption = netPower
                // p/pv_en :: energy production (kWh)
                const energyProduction = pv_en

                // ess_en :: energy storage energy (kWh)
                const essEnergy = ess_en

                const loadSideEnergy = getLoadSideProduction(
                  state$,
                  energyProduction
                )

                // c :: consumption
                const consumption = essEnergy + netEnergy + loadSideEnergy

                return energyDataActions.LIVE_ENERGY_DATA_NOTIFICATION({
                  [new Date(data.time * 1000).toISOString()]: {
                    isSolarAvailable: is(Number, data.pv_p),
                    p: roundDecimals(energyProduction),
                    s: roundDecimals(essEnergy),
                    c: roundDecimals(consumption),
                    pp: roundDecimals(powerProduction),
                    pc: roundDecimals(powerConsumption),
                    ps: roundDecimals(energyStoragePower),
                    // soc:: stage of charge
                    soc: roundDecimals(data.soc * 100),
                    rawData: data
                  }
                })
              }
            }
          })
        )
      )
    ),
    catchError(err => {
      return of(
        energyDataActions.LIVE_ENERGY_DATA_ERROR(
          err.stack ? err.stack : err.toString()
        )
      )
    })
  )
