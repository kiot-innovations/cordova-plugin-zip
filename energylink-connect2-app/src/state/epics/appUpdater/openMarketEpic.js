import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { map, exhaustMap, catchError } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { createExternalLinkHandler } from 'shared/routing'
import { isDebug, isIos } from 'shared/utils'
import {
  APP_UPDATE_OPEN_MARKET,
  APP_UPDATE_OPEN_MARKET_SUCCESS,
  APP_UPDATE_OPEN_MARKET_ERROR
} from 'state/actions/global'

const APPLE_ID = process.env.REACT_APP_APPLE_ID
const ANDROID_ID = process.env.REACT_APP_ANDROID_ID
const TYPE = isDebug ? 'beta' : 'apps'

const APPLE_URL = `itms-${TYPE}://itunes.apple.com/app/`

const handleAppStore = () => {
  createExternalLinkHandler(APPLE_URL + APPLE_ID)()
  return of(APP_UPDATE_OPEN_MARKET_SUCCESS())
}

const handleAndroidStore = () =>
  new Promise((resolve, reject) =>
    window.cordova.plugins.market.open(ANDROID_ID, resolve, reject)
  )

export const openMarketEpic = action$ =>
  action$.pipe(
    ofType(APP_UPDATE_OPEN_MARKET.getType()),
    exhaustMap(() =>
      isIos()
        ? handleAppStore()
        : from(handleAndroidStore()).pipe(
            map(APP_UPDATE_OPEN_MARKET_SUCCESS),
            catchError(error => {
              Sentry.addBreadcrumb({
                data: {
                  path: window.location.hash,
                  environment: process.env.REACT_APP_FLAVOR
                },
                message: error.message,
                level: Sentry.Severity.Warning
              })
              Sentry.captureException(error)
              return of(APP_UPDATE_OPEN_MARKET_ERROR())
            })
          )
    )
  )
