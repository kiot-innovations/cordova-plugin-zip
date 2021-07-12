import { ofType } from 'redux-observable'
import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'

import * as mobileActions from '../../actions/mobile'

import { CHECK_APP_UPDATE_INIT } from 'state/actions/global'

export const deviceResumeEpic = () =>
  fromEvent(document, 'resume').pipe(map(() => mobileActions.DEVICE_RESUME()))

export const checkForUpdatesEpic = action$ =>
  action$.pipe(
    ofType(mobileActions.DEVICE_RESUME.getType()),
    map(CHECK_APP_UPDATE_INIT)
  )
