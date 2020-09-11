import { path } from 'ramda'
import { from, of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import { isConnectedToPVS } from 'shared/PVSUtils'

export const wifiCheckOperator = state$ =>
  exhaustMap(action => {
    const allowWifiDownloadSetting = path(
      ['value', 'fileDownloader', 'settings', 'allowDownloadWithPVS'],
      state$
    )

    return allowWifiDownloadSetting
      ? of({ action, canDownload: true })
      : from(isConnectedToPVS()).pipe(
          map(isConnected => ({
            action,
            canDownload: !isConnected
          })),
          catchError(() =>
            of({
              action,
              canDownload: true
            })
          )
        )
  })
