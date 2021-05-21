import { combineLatest, from, of, ReplaySubject } from 'rxjs'
import { ofType } from 'redux-observable'
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators'
import * as Sentry from '@sentry/browser'
import { pathOr } from 'ramda'

import { DOWNLOAD_OS_INIT } from 'state/actions/ess'
import {
  DOWNLOAD_URLS_UPDATED,
  PVS_FIRMWARE_DOWNLOAD_INIT
} from 'state/actions/fileDownloader'
import {
  PVS6_GRID_PROFILE_DOWNLOAD_INIT,
  PVS5_GRID_PROFILE_DOWNLOAD_INIT
} from 'state/actions/gridProfileDownloader'

export const pvsUpdateUrl$ = new ReplaySubject(1)
export const pvs6GridProfileUpdateUrl$ = new ReplaySubject(1)
export const pvs5GridProfileUpdateUrl$ = new ReplaySubject(1)
export const essUpdateUrl$ = new ReplaySubject(1)

export const waitForObservable = observable$ =>
  mergeMap(action => combineLatest([from([action]), observable$]))

const getPvs6UpdateUrls = (action$, state$) =>
  action$.pipe(
    ofType(
      PVS_FIRMWARE_DOWNLOAD_INIT.getType(),
      PVS6_GRID_PROFILE_DOWNLOAD_INIT.getType(),
      DOWNLOAD_OS_INIT.getType()
    ),
    exhaustMap(() =>
      from(
        fetch(process.env.REACT_APP_PVS6_HARDWARE_URLS).then(response =>
          response.json()
        )
      ).pipe(
        map(urls => {
          const { gp } = urls
          let { pvs, ess } = urls

          const essUpdateOverrideURL = pathOr(
            false,
            ['value', 'fileDownloader', 'settings', 'essUpdateOverride', 'url'],
            state$
          )
          const pvsUpdateOverrideURL = pathOr(
            false,
            ['value', 'fileDownloader', 'settings', 'pvsUpdateOverride', 'url'],
            state$
          )

          if (essUpdateOverrideURL) {
            ess = essUpdateOverrideURL
          }
          if (pvsUpdateOverrideURL) {
            pvs = pvsUpdateOverrideURL
          }

          localStorage.setItem('pvs-url', pvs)
          localStorage.setItem('ess-url', ess)
          localStorage.setItem('pvs6-gp-url', gp)

          pvsUpdateUrl$.next(pvs)
          essUpdateUrl$.next(ess)
          pvs6GridProfileUpdateUrl$.next(gp)

          return DOWNLOAD_URLS_UPDATED('PVS6')
        }),
        catchError(error => {
          const pvs = localStorage.getItem('pvs-url')
          const ess = localStorage.getItem('ess-url')
          const gp = localStorage.getItem('pvs6-gp-url')

          if (pvs === null || ess === null || gp === null) {
            Sentry.captureException(error)
            return of({ type: 'ERROR GETTING PVS6 UPDATE URLs' })
          }

          pvsUpdateUrl$.next(pvs)
          essUpdateUrl$.next(ess)
          pvs6GridProfileUpdateUrl$.next(gp)

          return of(DOWNLOAD_URLS_UPDATED('PVS6'))
        })
      )
    )
  )

const getPvs5UpdateUrls = (action$, state$) =>
  action$.pipe(
    ofType(PVS5_GRID_PROFILE_DOWNLOAD_INIT.getType()),
    exhaustMap(() =>
      from(
        fetch(process.env.REACT_APP_PVS5_HARDWARE_URLS).then(response =>
          response.json()
        )
      ).pipe(
        map(urls => {
          const { gp } = urls

          localStorage.setItem('pvs5-gp-url', gp)

          pvs5GridProfileUpdateUrl$.next(gp)

          return DOWNLOAD_URLS_UPDATED('PVS5')
        }),
        catchError(error => {
          const gp = localStorage.getItem('pvs5-gp-url')

          if (gp === null) {
            Sentry.captureException(error)
            return of({ type: 'ERROR GETTING PVS5 UPDATE URLs' })
          }

          pvs5GridProfileUpdateUrl$.next(gp)

          return of(DOWNLOAD_URLS_UPDATED('PVS5'))
        })
      )
    )
  )

export default [getPvs6UpdateUrls, getPvs5UpdateUrls]
