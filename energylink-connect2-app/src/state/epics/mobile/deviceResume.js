import { ofType } from 'redux-observable'
import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'

import { CHECK_APP_UPDATE_INIT } from 'state/actions/global'
import { DEVICE_RESUME } from 'state/actions/mobile'

export const deviceResumeEpic = () =>
  fromEvent(document, 'resume').pipe(map(() => DEVICE_RESUME()))

export const checkForUpdatesEpic = action$ =>
  action$.pipe(ofType(DEVICE_RESUME.getType()), map(CHECK_APP_UPDATE_INIT))
