import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'
import * as mobileActions from '../../actions/mobile'

export const deviceResumeEpic = () =>
  fromEvent(document, 'resume').pipe(map(() => mobileActions.DEVICE_RESUME()))
