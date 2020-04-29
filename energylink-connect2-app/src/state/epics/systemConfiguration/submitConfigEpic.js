import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'
import { getApiPVS } from 'shared/api'
import { path } from 'ramda'
import {
  SUBMIT_CONFIG,
  SUBMIT_CONFIG_SUCCESS,
  SUBMIT_CONFIG_ERROR,
  SUBMIT_EXPORTLIMIT,
  SUBMIT_GRIDVOLTAGE
} from 'state/actions/systemConfiguration'

// const submitConfiguration = async payload => {
//   try {
//     const swagger = await getApiPVS()
//     const res = await Promise.all([
//       swagger.apis.grid.set(
//         { id: 1 },
//         {
//           requestBody: {
//             ID: payload.gridProfile,
//             lazy: payload.lazyGridProfile
//           }
//         }
//       ),
//       swagger.apis.grid.setGridExportLimit(
//         { id: 1 },
//         { requestBody: { Limit: payload.exportLimit } }
//       ),
//       swagger.apis.grid.setGridVoltage(
//         { id: 1 },
//         { requestBody: { grid_voltage: payload.gridVoltage } }
//       )
//     ])
//     const [setGridProfiles, setExportLimit, setGridVoltage] = res.map(
//       prop('body')
//     )
//     return { setGridProfiles, setExportLimit, setGridVoltage }
//   } catch (e) {
//     console.error(e)
//   }
// }

export const submitGridProfileEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_CONFIG.getType()),
    switchMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'grid']))
        .then(api =>
          api.grid.set(
            { id: 1 },
            {
              requestBody: {
                ID: payload.gridProfile,
                lazy: payload.lazyGridProfile
              }
            }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.success === true
            ? SUBMIT_EXPORTLIMIT(payload)
            : SUBMIT_CONFIG_ERROR('Error while setting grid profile')
        )
      )
    })
  )
}

export const submitExportLimitEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_EXPORTLIMIT.getType()),
    switchMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'grid']))
        .then(api =>
          api.grid.setExportLimit(
            { id: 1 },
            { requestBody: { Limit: payload.exportLimit } }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.success === true
            ? SUBMIT_GRIDVOLTAGE(payload)
            : SUBMIT_CONFIG_ERROR('Error while setting export limit')
        )
      )
    })
  )
}

export const submitGridVoltageEpic = action$ => {
  return action$.pipe(
    ofType(SUBMIT_GRIDVOLTAGE.getType()),
    switchMap(({ payload }) => {
      const promise = getApiPVS()
        .then(path(['apis', 'grid']))
        .then(api =>
          api.grid.setGridVoltage(
            { id: 1 },
            { requestBody: { grid_voltage: payload.gridVoltage } }
          )
        )

      return from(promise).pipe(
        map(response =>
          response.success === true
            ? SUBMIT_CONFIG_SUCCESS(response)
            : SUBMIT_CONFIG_ERROR('Error while setting grid voltage')
        )
      )
    })
  )
}

// export const submitConfigurationEpic = action$ => {
//   return action$.pipe(
//     ofType(SUBMIT_CONFIG.getType()),
//     switchMap(({ payload }) =>
//       from(submitConfiguration(payload)).pipe(
//         switchMap(async response =>
//           findProp('error', response)
//             ? SUBMIT_CONFIG_ERROR(response)
//             : SUBMIT_CONFIG_SUCCESS(response)
//         ),
//         catchError(error => of(SUBMIT_CONFIG_ERROR(error.message)))
//       )
//     )
//   )
// }
