import { promisify } from 'util'

import { ofType } from 'redux-observable'
import { of, from, empty, throwError } from 'rxjs'
import { mergeMap, map, catchError, tap } from 'rxjs/operators'

import { httpPost } from 'shared/fetch'
import * as mobileActions from 'state/actions/mobile'

export const nabtoAssociateDeviceEpic = (action$, state$) =>
  action$.pipe(
    ofType(mobileActions.DEVICE_READY.getType()),
    mergeMap(() => {
      const nabto = window.nabto || global.nabto || null
      const device = window.device || global.device || null
      const userId = state$.value.user.data.uniqueId
      const username = state$.value.user.data.email
      const pvsSN = state$.value.pvs.serialNumber

      if (!userId || !pvsSN || !process.env.REACT_APP_IS_MOBILE) {
        // We are not logged in
        return empty()
      }

      if (!nabto) {
        return of(
          mobileActions.NABTO_ERROR('Nabto not properly injected into the page')
        )
      }

      const startupAndOpenProfile = promisify(nabto.startupAndOpenProfile)
      const createKeyPair = promisify(nabto.createKeyPair)
      const getFingerprint = promisify(nabto.getFingerprint)

      return from(startupAndOpenProfile(username, device.uuid)).pipe(
        mergeMap(() => from(getFingerprint(username))),
        tap(() => console.info('found fingerprint')),
        map(fingerprint => mobileActions.NABTO_ASSOCIATED_SUCCESS(fingerprint)),

        catchError(error => {
          console.info('error', error)
          if (error && error.message === 'Error opening keypair') {
            return from(createKeyPair(username, device.uuid)).pipe(
              tap(fingerprint =>
                console.warn(`Created fingerprint ${fingerprint}`)
              ),
              mergeMap(() => from(getFingerprint(username))),
              mergeMap(fingerprint =>
                from(
                  httpPost(
                    `/p2p/${pvsSN}/associate`,
                    {
                      clientName: `${username}_${device.uuid}`,
                      fingerprint: fingerprint.slice(0, -1)
                    },
                    state$.value
                  )
                ).pipe(
                  map(response => {
                    console.info('associated fingerprint', response)
                    return response.status === 200
                      ? mobileActions.NABTO_ASSOCIATED_SUCCESS(fingerprint)
                      : mobileActions.NABTO_ERROR({
                          status: response.status,
                          data: response.data
                        })
                  })
                )
              )
            )
          }
          return throwError(error)
        }),
        catchError(err => {
          console.error('nabto error', err)
          return of(mobileActions.NABTO_ERROR(err))
        })
      )
    })
  )
