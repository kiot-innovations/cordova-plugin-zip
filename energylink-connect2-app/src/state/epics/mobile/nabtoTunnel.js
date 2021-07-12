import { promisify } from 'util'

import { ofType } from 'redux-observable'
import { of, from, empty } from 'rxjs'
import {
  mergeMap,
  map,
  catchError,
  retryWhen,
  tap,
  delay
} from 'rxjs/operators'

import * as mobileActions from '../../actions/mobile'

export const nabtoTunnelEpic = (action$, state$) =>
  action$.pipe(
    ofType(mobileActions.NABTO_ASSOCIATED_SUCCESS.getType()),
    mergeMap(fingerprint => {
      console.info('fingerprint', fingerprint)
      const nabto = window.nabto || global.nabto || null
      const device = window.device || global.device || null
      const TARGET = 'dywakqas.ufbr9.appmyproduct.com'
      const port = process.env.REACT_APP_NABTO_PORT
      const isLoggedIn = !!state$.value.user.auth.userId
      const username = state$.value.user.auth.username

      if (!isLoggedIn) {
        return empty()
      }

      if (!port) {
        throw new Error('Pleace specify a port to connect to')
      }

      if (!nabto) {
        return of(
          mobileActions.NABTO_ERROR('Nabto not properly injected into the page')
        )
      }

      const startupAndOpenProfile = promisify(nabto.startupAndOpenProfile)
      const tunnelOpenTcp = promisify(nabto.tunnelOpenTcp)
      const tunnelPort = promisify(nabto.tunnelPort)

      // Use this to map tunnel states
      // const tunnelState = promisify(nabto.tunnelState)
      // const state = await tunnelState(tunnel)

      return from(startupAndOpenProfile(username, device.uuid)).pipe(
        tap(() => console.info('opening profile')),
        mergeMap(() => from(tunnelOpenTcp(TARGET, port))),
        tap(() => console.info('opened tunnel')),
        mergeMap(tunnel => from(tunnelPort(tunnel))),
        map(localPort => mobileActions.NABTO_PORT_OPEN(localPort)),
        retryWhen(errors =>
          errors.pipe(
            tap(err => console.error('Nabto tunnel error', err)),
            delay(1000)
          )
        )
      )
    }),
    catchError(error => of(mobileActions.NABTO_ERROR(error)))
  )
