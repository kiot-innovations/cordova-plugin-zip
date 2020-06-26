import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'
import { GET_PREDISCOVERY } from 'state/actions/storage'
import { GET_PREDISCOVERY_SUCCESS } from '../../actions/storage'

//TODO: Rewrite this epic when swagger docs & mock-server gets updated on the Pi
export const getPreDiscoveryEpic = action$ => {
  return action$.pipe(
    ofType(GET_PREDISCOVERY.getType()),
    switchMap(() => {
      const promise = fetch(
        'http://192.168.4.1:4000/cgi-bin/dl_cgi/energy-storage-systems/devices',
        { method: 'GET' }
      )

      return from(promise).pipe(
        map(response => GET_PREDISCOVERY_SUCCESS(response.body))
      )
    })
  )
}
