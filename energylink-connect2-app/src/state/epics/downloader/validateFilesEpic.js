import { any, equals, path, prop } from 'ramda'
import { ofType } from 'redux-observable'
import { forkJoin, from, of } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  withLatestFrom
} from 'rxjs/operators'
import {
  FILES_VERIFY,
  FILES_VERIFY_ESS_COMPLETED,
  FILES_VERIFY_FAILED,
  FILES_VERIFY_GP_COMPLETED,
  FILES_VERIFY_PVS_COMPLETED
} from 'state/actions/fileDownloader'
import { getMd5FromFile } from 'shared/cordovaMapping'
import {
  getFileNameFromURL,
  getFirmwareVersionData,
  verifySHA256
} from 'shared/fileSystem'
import { getExpectedMD5 } from 'shared/utils'
import { EMPTY_ACTION } from 'state/actions/share'

import { gridProfileUpdateUrl$, pvsUpdateUrl$ } from './latestUrls'

const checkAny = (value, state$) =>
  any(equals(value), [
    path(['value', 'fileDownloader', 'verification', 'gpVerified'], state$),
    path(['value', 'fileDownloader', 'verification', 'pvsVerified'], state$),
    path(['value', 'fileDownloader', 'verification', 'essVerified'], state$)
  ])

export const gridProfileValidatedEpic = action$ =>
  action$.pipe(
    ofType(FILES_VERIFY.getType()),
    withLatestFrom(gridProfileUpdateUrl$),
    exhaustMap(([, gridProfileURL]) =>
      forkJoin([
        from(getMd5FromFile(`firmware/${getFileNameFromURL(gridProfileURL)}`)),
        from(getExpectedMD5(gridProfileURL))
      ]).pipe(
        map(([fileMd5, expectedMd5]) =>
          FILES_VERIFY_GP_COMPLETED(fileMd5 === expectedMd5)
        ),
        catchError(() => of(FILES_VERIFY_GP_COMPLETED(false)))
      )
    )
  )

export const essValidatedEpic = (action$, state$) =>
  action$.pipe(
    ofType(FILES_VERIFY.getType()),
    exhaustMap(() =>
      from(getMd5FromFile(state$.value.ess.filePath)).pipe(
        map(fileMD5 =>
          FILES_VERIFY_ESS_COMPLETED(
            path(['value', 'ess', 'md5'], state$) === fileMD5
          )
        ),
        catchError(() => of(FILES_VERIFY_ESS_COMPLETED(false)))
      )
    )
  )

export const pvsValidatedEpic = action$ =>
  action$.pipe(
    ofType(FILES_VERIFY.getType()),
    withLatestFrom(pvsUpdateUrl$),
    exhaustMap(([, pvsUpdateURL]) =>
      from(
        verifySHA256(
          `firmware/${prop(
            'pvsFileSystemName',
            getFirmwareVersionData(pvsUpdateURL)
          )}`
        )
      ).pipe(
        map(() => FILES_VERIFY_PVS_COMPLETED(true)),
        catchError(() => of(FILES_VERIFY_PVS_COMPLETED(false)))
      )
    )
  )

export const verificationsCompletedEpic = (action$, state$) =>
  action$.pipe(
    ofType(
      FILES_VERIFY_GP_COMPLETED.getType(),
      FILES_VERIFY_PVS_COMPLETED.getType(),
      FILES_VERIFY_ESS_COMPLETED.getType()
    ),
    switchMap(() => {
      if (checkAny(null, state$)) {
        return of(EMPTY_ACTION()) // checks did not finished.
      }

      return checkAny(false, state$)
        ? of(FILES_VERIFY_FAILED())
        : of(EMPTY_ACTION())
    })
  )

export default [
  gridProfileValidatedEpic,
  essValidatedEpic,
  pvsValidatedEpic,
  verificationsCompletedEpic
]
