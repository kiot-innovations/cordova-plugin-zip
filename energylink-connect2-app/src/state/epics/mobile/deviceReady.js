import { fromEvent } from 'rxjs'
import { map } from 'rxjs/operators'
import * as mobileActions from '../../actions/mobile'

export const deviceReadyEpic = () =>
  fromEvent(document, 'deviceready').pipe(
    map(() => {
      window.open = cordova.InAppBrowser.open // eslint-disable-line no-undef
      return mobileActions.DEVICE_READY()
    })
  )
