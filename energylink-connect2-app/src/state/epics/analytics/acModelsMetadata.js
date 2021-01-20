import { ofType } from 'redux-observable'
import { equals, prop, compose, uniq, map, filter, pathOr, path } from 'ramda'
import { exhaustMap, withLatestFrom } from 'rxjs/operators'

import { SET_METADATA_INIT } from 'state/actions/pvs'
import { of } from 'rxjs'
import { setACModuleType } from 'shared/analytics'
import { getTimePassed } from 'shared/utils'

const isInverter = n => equals('Inverter', prop('DEVICE_TYPE', n))

const getModifiedDevices = compose(
  uniq,
  map(prop('modelStr')),
  filter(isInverter)
)

const EssHealthCeckEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_METADATA_INIT.getType()),
    withLatestFrom(state$),
    exhaustMap(([{ payload }, state]) => {
      const selectingAcModlesStartPoint = path(
        ['analytics', 'selectingACModelTimer'],
        state
      )
      const timePassed = getTimePassed(selectingAcModlesStartPoint)
      const metadata = pathOr([], ['metaData', 'devices'], payload)
      const moduleTypes = getModifiedDevices(metadata)
      console.warn('HELLO WORLD')
      return of(setACModuleType({ moduleTypes, timeElapsed: timePassed }))
    })
  )

export default [EssHealthCeckEpic]
