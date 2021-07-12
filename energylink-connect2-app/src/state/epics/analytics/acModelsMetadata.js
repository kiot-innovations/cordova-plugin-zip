import { equals, prop, compose, uniq, map, filter, pathOr, path } from 'ramda'
import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { exhaustMap, withLatestFrom } from 'rxjs/operators'

import { setACModuleType } from 'shared/analytics'
import { getElapsedTime } from 'shared/utils'
import { SET_METADATA_INIT } from 'state/actions/pvs'

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
      const selectingAcModulesStartPoint = path(
        ['analytics', 'selectingACModelTimer'],
        state
      )
      const timePassed = getElapsedTime(selectingAcModulesStartPoint)
      const metadata = pathOr([], ['metaData', 'devices'], payload)
      const moduleTypes = getModifiedDevices(metadata)
      return of(setACModuleType({ moduleTypes, timeElapsed: timePassed }))
    })
  )

export default [EssHealthCeckEpic]
