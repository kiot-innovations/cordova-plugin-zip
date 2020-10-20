import { from, of, ReplaySubject } from 'rxjs'
import { ofType } from 'redux-observable'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import * as Sentry from '@sentry/browser'

import { DOWNLOAD_OS_INIT } from 'state/actions/ess'
import {
  DOWNLOAD_URLS_UPDATED,
  PVS_FIRMWARE_DOWNLOAD_INIT
} from 'state/actions/fileDownloader'
import { GRID_PROFILE_DOWNLOAD_INIT } from 'state/actions/gridProfileDownloader'

export const pvsUpdateUrl$ = new ReplaySubject(1)
export const gridProfileUpdateUrl$ = new ReplaySubject(1)
export const essUpdateUrl$ = new ReplaySubject(1)

/**
 * The decision in why this rxjs way of the architecture instead of the redux way is
 * because of the benefits of using withLatestFrom, the downloads will not proceed
 * until there is a value inside the observable.
 * @param action$
 * @return {*}
 */
const getTheLatestURL = action$ =>
  action$.pipe(
    ofType(
      PVS_FIRMWARE_DOWNLOAD_INIT.getType(),
      GRID_PROFILE_DOWNLOAD_INIT.getType(),
      DOWNLOAD_OS_INIT.getType()
    ),
    exhaustMap(() =>
      from(
        fetch(process.env.REACT_APP_HARDWARE_URLS).then(res => res.text())
      ).pipe(
        /**
         * The reason for the weird try/catch inside this map is because we need to ba able to check if the endpoint gives us the latest version or the previous one.
         * Example of the "old" response
         *      https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-cylon/8133/fwup/fwup.lua
         * Example of the "new" response
         *     {
         *      "pvs": "https://fw-assets-pvs6-dev.dev-edp.sunpower.com/staging-prod-cylon/8133/fwup/fwup.lua",
         *      "ess": "https://prod-jfrog-artifactory-proxy-oauth2.p2e.io/spfw/pvs-connected-devices-firmware/chief_hopper/ChiefHopper.zip",
         *      "gp": "https://s3-us-west-2.amazonaws.com/2oduso0/gridprofiles/v2/gridprofiles.tar.gz"
         *     }
         */
        map(text => {
          try {
            const { pvs, ess, gp } = JSON.parse(text)
            localStorage.setItem('pvs-url', pvs)
            localStorage.setItem('ess-url', ess)
            localStorage.setItem('gp-url', gp)

            pvsUpdateUrl$.next(pvs)
            gridProfileUpdateUrl$.next(gp)
            essUpdateUrl$.next(ess)

            return DOWNLOAD_URLS_UPDATED()
          } catch (e) {
            localStorage.setItem('pvs-url', text)

            pvsUpdateUrl$.next(text)
            gridProfileUpdateUrl$.next(process.env.REACT_APP_GRID_PROFILE_URL)
            essUpdateUrl$.next(process.env.REACT_APP_ESS_DOWNLOAD_URL)

            return DOWNLOAD_URLS_UPDATED()
          }
        }),
        catchError(err => {
          const pvs = localStorage.getItem('pvs-url')
          const ess = localStorage.getItem('ess-url')
          const gp = localStorage.getItem('gp-url')

          if (pvs === null || ess === null || gp === null) {
            Sentry.captureException(err)
            return of({ type: 'NO UPDATE URL :(' })
          }
          pvsUpdateUrl$.next(pvs)
          gridProfileUpdateUrl$.next(gp)
          essUpdateUrl$.next(ess)
          return of(DOWNLOAD_URLS_UPDATED())
        })
      )
    )
  )
export default getTheLatestURL
