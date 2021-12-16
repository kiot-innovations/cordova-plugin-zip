import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { iif, of } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { UpdateTuturialsError } from 'shared/errors'
import { getElapsedTime } from 'shared/utils'
import { LOGIN_SUCCESS } from 'state/actions/auth'
import {
  UPDATE_TUTORIALS,
  UPDATE_TUTORIALS_ERROR
} from 'state/actions/knowledgeBase'
import { DEVICE_RESUME } from 'state/actions/mobile'
import { status } from 'state/reducers/knowledgeBase'

const { UNKNOWN, FETCHED, NEVER_FETCHED } = status

const getLastSuccessfulUpdate = pathOr(0, [
  'value',
  'knowledgeBase',
  'lastSuccessfulUpdateOn'
])

const getStatus = pathOr(UNKNOWN, ['value', 'knowledgeBase', 'status'])

const DELAY_BEFORE_UPDATE = 30 * 60 // 30 minutes

const tutorialsUrl = process.env.REACT_APP_TUTORIALS_URL

export const updateTutorials = (action$, state$, { getJSON }) =>
  action$.pipe(
    ofType(LOGIN_SUCCESS.getType(), DEVICE_RESUME.getType()),
    switchMap(() =>
      iif(
        () =>
          getStatus(state$) === NEVER_FETCHED ||
          getElapsedTime(getLastSuccessfulUpdate(state$)) >=
            DELAY_BEFORE_UPDATE,
        getJSON(tutorialsUrl, {
          'Cache-Control': 'private, no-store, no-cache, max-age=0'
        }).pipe(
          switchMap(response => {
            const { tutorials: tutorialList } = response
            const timestamp = Date.now()
            const status = FETCHED

            return of(
              UPDATE_TUTORIALS({
                tutorialList,
                timestamp,
                status
              })
            )
          }),
          catchError(({ message }) => {
            const error = new UpdateTuturialsError(message)

            Sentry.setTag('endpoint', 'APP_TUTORIALS_URL')
            Sentry.captureException(error)
            return of(UPDATE_TUTORIALS_ERROR(error))
          })
        )
      )
    )
  )
