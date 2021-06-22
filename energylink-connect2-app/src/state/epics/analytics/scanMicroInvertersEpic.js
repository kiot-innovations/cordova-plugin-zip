import { ofType } from 'redux-observable'
import { switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import { any, filter, length, propEq } from 'ramda'
import { scanMicroInverters } from 'shared/analytics'
import { FETCH_CANDIDATES_COMPLETE } from 'state/actions/devices'
import { UPDATE_NOT_FOUND_MIS_SERIAL_NUMBERS } from 'state/actions/analytics'
import {
  getElapsedTime,
  snEntryMethods,
  filterFoundMI,
  getNotFoundMIs
} from 'shared/utils'

const scanMicroInvertersEpic = (action$, state$) =>
  action$.pipe(
    ofType(FETCH_CANDIDATES_COMPLETE.getType()),
    switchMap(() => {
      const {
        devices: { candidates },
        pvs: { serialNumbers },
        analytics: {
          scanMicroInvertersTimer,
          scanMicroInvertersNotFoundSerialNumbers
        }
      } = state$.value
      const { nonOkMI } = filterFoundMI(serialNumbers, candidates)
      const [notFound, notFoundSerialNumbers] = getNotFoundMIs(
        scanMicroInvertersNotFoundSerialNumbers,
        nonOkMI
      )
      const withScanEntryMethod = propEq('entryMethod', snEntryMethods.SCAN)
      const withManualEntryMethod = propEq('entryMethod', snEntryMethods.MANUAL)

      // Scanning is successful if at least one MI was entered using the
      // scanning. An MI entry method can be changed from snEntryMethods.SCAN to
      // snEntryMethods.MANUAL if edited manually.
      const success = any(withScanEntryMethod, serialNumbers)
      const manualEntered = length(filter(withManualEntryMethod, serialNumbers))
      const scanEntered = length(filter(withScanEntryMethod, serialNumbers))
      const duration = getElapsedTime(scanMicroInvertersTimer)

      return of(
        scanMicroInverters({
          success,
          manualEntered,
          scanEntered,
          duration,
          notFound
        }),
        UPDATE_NOT_FOUND_MIS_SERIAL_NUMBERS(notFoundSerialNumbers)
      )
    })
  )

export default scanMicroInvertersEpic
