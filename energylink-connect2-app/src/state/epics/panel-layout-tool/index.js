import * as Sentry from '@sentry/browser'
import { actions, mapToPVS, mapFromPVS } from '@sunpower/panel-layout-tool'
import { pathOr, filter, propIs, compose, length } from 'ramda'
import { ofType } from 'redux-observable'
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators'
import { EMPTY, from, of } from 'rxjs'

import { getApiPVS } from 'shared/api'
import {
  PLT_LOAD,
  PLT_LOAD_ERROR,
  PLT_LOAD_FINISHED,
  PLT_MARK_AS_CHANGED,
  PLT_SAVE,
  PLT_SAVE_ERROR,
  PLT_SAVE_FINISHED
} from 'state/actions/panel-layout-tool'
import { SUBMIT_COMMISSION_SUCCESS } from 'state/actions/systemConfiguration'

export const getPanelLayout = async () => {
  const { apis } = await getApiPVS()
  const response = await apis.panels.getPanelsLayout()
  // filters out not-assigned panels
  const panels = compose(
    filter(propIs(Number, 'xCoordinate')),
    pathOr([], ['body', 'result', 'panels'])
  )(response)

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

export const getPanelLayoutEpic = action$ =>
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
    ofType(PLT_SAVE.getType(), SUBMIT_COMMISSION_SUCCESS.getType()),
    switchMap(() => {
      const panels = pathOr([], ['panel_layout_tool', 'panels'], state$.value)
      return length(panels)
        ? from(savePanelLayout(panels)).pipe(
            map(PLT_SAVE_FINISHED),
            catchError(err => {
              Sentry.captureException(err)
              return of(PLT_SAVE_ERROR.asError('PLT_SAVE_ERROR'))
            })
          )
        : EMPTY
    })
  )

export const markPanelLayoutAsChangedEpic = action$ =>
  action$.pipe(
    ofType(
      actions.add.getType(),
      actions.updatePosition.getType(),
      actions.updateGroupPosition.getType(),
      actions.setRotation.getType(),
      actions.remove.getType(),
      actions.rotateSelectedGroup.getType()
    ),
    map(PLT_MARK_AS_CHANGED)
  )

export default [
  getPanelLayoutEpic,
  savePanelLayoutEpic,
  markPanelLayoutAsChangedEpic
]
