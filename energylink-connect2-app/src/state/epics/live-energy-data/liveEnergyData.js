import { Observable, of } from 'rxjs'
import {
  map,
  catchError,
  mergeMap,
  retryWhen,
  tap,
  delay
} from 'rxjs/operators'
import { ofType } from 'redux-observable'
import { Client as WebSocket } from 'rpc-websockets'

import * as energyDataActions from '../../actions/energy-data'
import * as networkActions from '../../actions/network'

import { roundDecimals } from 'shared/rounding'
import { compose, always, equals, ifElse, pathOr } from 'ramda'

const createWebsocketObservable = () =>
  new Observable(subscriber => {
    const ws = new WebSocket(process.env.REACT_APP_PVS_WS, {
      reconnect: false
    })

    ws.on('error', err => subscriber.error(err))

    ws.on('close', () => subscriber.error(new Error('Connection closed')))

    ws.on('open', () => {
      ws.subscribe('power')
      subscriber.next({ evt: 'open' })

      ws.on('power', data => subscriber.next({ evt: 'power', data }))

      /*ws.call('GetMetrics', ['power', '1d', '-2d', '-2d'])
        .then(yesterdaysData =>
          ws.call('GetMetrics', ['power', '1d', '-1d', '-1d']).then(data => {
            subscriber.next({
              evt: 'dailyPower',
              data: {
                yesterday: yesterdaysData.rows.pop(),
                today: data.rows.pop()
              }
            })
          })
        )
        .catch(err =>
          subscriber.error(
            new Error(`Error colleting daily metrics: ${err.message}`)
          )
        )*/

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

const getProductionValueCorrectly = (state, production) =>
  compose(
    ifElse(equals('GROSS_CONSUMPTION_LINESIDE'), always(production), always(0)),
    getMeterConfig
  )(state)

export const liveEnergyData = (action$, state$) =>
  action$.pipe(
    ofType(networkActions.PVS_CONNECTION_SUCCESS.getType()),
    mergeMap(({ payload }) =>
      createWebsocketObservable().pipe(
        retryWhen(errors =>
          errors.pipe(
            tap(err => console.error('Websocket connection', err)),
            delay(1000)
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
                soc: data.today[1],
                net_en: data.today[5] - (data.yesterday[5] || 0),
                pv_en: data.today[6] - (data.yesterday[6] || 0),
                ess_en: data.today[7] - (data.yesterday[7] || 0)
              }
              return energyDataActions.LIVE_ENERGY_DATA_DAILY({
                soc: diffData.soc,
                p: diffData.pv_en,
                s: diffData.ess_en,
                c: diffData.pv_en + diffData.ess_en + diffData.net_en
              })
            case 'power':
            default: {
              // pp/pv_p :: power production (Kw)
              const pp = data.pv_p < 0.01 ? 0 : data.pv_p
              // ps/ess_p :: energy storage power (kw)
              const ps = data.ess_p < 0.01 ? 0 : data.ess_p * -1
              // net_p :: grid power (Kw)
              const net = data.net_p < 0.01 ? 0 : data.net_p

              // pc :: power consumption (Kw)
              const pc = pp + ps + net
              // p/pv_en :: energy production (KwH)
              const p = data.pv_en < 0.01 ? 0 : data.pv_en
              // net_en :: grid energy (KwH)
              const net_en = data.net_en < 0.01 ? 0 : data.net_en
              // net_en :: energy storage energy (KwH)
              const s = data.ess_en < 0.01 ? 0 : data.ess_en * -1

              const lineSide = getProductionValueCorrectly(state$, p)

              // c :: consumption
              const c = p + s + net_en - lineSide

              return energyDataActions.LIVE_ENERGY_DATA_NOTIFICATION({
                [new Date(data.time * 1000).toISOString()]: {
                  p: roundDecimals(p),
                  s: roundDecimals(s),
                  c: roundDecimals(c),
                  pp: roundDecimals(pp),
                  pc: roundDecimals(pc),
                  ps: roundDecimals(ps),
                  // soc:: stage of charge
                  soc: roundDecimals(data.soc)
                }
              })
            }
          }
        })
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
