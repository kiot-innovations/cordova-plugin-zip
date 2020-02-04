import { Observable, of } from 'rxjs'
import {
  map,
  catchError,
  mergeMap,
  retryWhen,
  tap,
  delay
} from 'rxjs/operators'
import { Client as WebSocket } from 'rpc-websockets'
import * as energyDataActions from '../../actions/energy-data'
import * as mobileActions from '../../actions/mobile'
import { roundDecimals } from '../../../shared/rounding'
import { ofType } from 'redux-observable'
import { LOGIN_SUCCESS } from 'state/actions/auth'

const createWebsocketObservable = () =>
  new Observable(subscriber => {
    const ws = new WebSocket(`ws://sunpowerconsole.com:9002`, {
      reconnect: false
    })

    ws.on('error', err => subscriber.error(err))

    ws.on('close', () => subscriber.error(new Error('Connection closed')))

    ws.on('open', () => {
      subscriber.next({ evt: 'open' })

      ws.on('power', data => subscriber.next({ evt: 'power', data }))

      ws.call('GetMetrics', ['power', '1d', '-2d', '-2d'])
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
        )

      return () => {
        ws.close()
      }
    })
  })

const kWTokWh = kW => kW / 3600

export const liveEnergyData = (action$, state$) =>
  action$.pipe(
    ofType(
      mobileActions.NABTO_PORT_OPEN.getType(),
      mobileActions.DEVICE_RESUME.getType(),
      LOGIN_SUCCESS().getType(),
      energyDataActions.ENERGY_DATA_START_POLLING.getType() // @todo: likely not required, but necesssary for testing
    ),
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
              const pp = data.pv_p < 0.01 ? 0 : data.pv_p
              const ps = data.ess_p < 0.01 ? 0 : data.ess_p * -1
              const net = data.net_p < 0.01 ? 0 : data.net_p

              const p = kWTokWh(pp)
              const s = kWTokWh(ps)
              const c = p + s + kWTokWh(net)
              const pc = pp + ps + net

              return energyDataActions.LIVE_ENERGY_DATA_NOTIFICATION({
                [new Date(data.time * 1000).toISOString()]: {
                  p,
                  s,
                  c,
                  pp: roundDecimals(pp),
                  pc: roundDecimals(pc),
                  ps: roundDecimals(ps),
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
