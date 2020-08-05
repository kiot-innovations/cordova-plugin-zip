import * as Sentry from '@sentry/browser'
import { actions, mapToPVS, mapFromPVS } from '@sunpower/panel-layout-tool'
import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { getApiPVS } from 'shared/api'
import {
  PLT_LOAD,
  PLT_LOAD_ERROR,
  PLT_LOAD_FINISHED,
  PLT_SAVE,
  PLT_SAVE_ERROR,
  PLT_SAVE_FINISHED
} from 'state/actions/panel-layout-tool'

export const getPanelLayout = async () => {
  const { apis } = await getApiPVS()
  const response = await apis.panels.getPanelsLayout()
  const panels = pathOr([], ['body', 'result', 'panels'], response)
  return mapFromPVS(panels)
}

export const savePanelLayout = async panels => {
  const { apis } = await getApiPVS()

  return await apis.panels.setPanelsLayout(
    {},
    {
      requestBody: {
        panels: mapToPVS(panels)
      }
    }
  )
}

export const getPanelLayoutEpic = (action$, state$) =>
  action$.pipe(
    ofType(PLT_LOAD.getType()),
    exhaustMap(() =>
      from(getPanelLayout()).pipe(
        switchMap(panels => of(actions.init(panels), PLT_LOAD_FINISHED())),
        catchError(() => of(PLT_LOAD_ERROR.asError()))
      )
    )
  )

export const savePanelLayoutEpic = (action$, state$) =>
  action$.pipe(
    ofType(PLT_SAVE.getType()),
    switchMap(() =>
      from(
        savePanelLayout(
          pathOr([], ['panel_layout_tool', 'panels'], state$.value)
        )
      ).pipe(
        map(PLT_SAVE_FINISHED),
        catchError(err => {
          Sentry.captureException(err)
          return of(PLT_SAVE_ERROR.asError('PLT_SAVE_ERROR'))
        })
      )
    )
  )

export default [getPanelLayoutEpic, savePanelLayoutEpic]
