import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import { map, exhaustMap, catchError } from 'rxjs/operators'
import {
  APP_UPDATE_OPEN_MARKET,
  APP_UPDATE_OPEN_MARKET_SUCCESS,
  APP_UPDATE_OPEN_MARKET_ERROR
} from 'state/actions/global'
import { getEnvironment, isIos } from 'shared/utils'
import { createExternalLinkHandler } from 'shared/routing'

const APPLE_ID = '1485622626'
const APPLE_URL = 'itms-apps://itunes.apple.com/app/'
const ANDROID_ID = 'com.sunpower.energylink.commissioning2'

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
                  environment: getEnvironment()
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
