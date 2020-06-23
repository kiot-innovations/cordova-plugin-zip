import { actions, utils } from '@sunpower/panel-layout-tool'
import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators'
import { from, of } from 'rxjs'
import { getApiPVS } from 'shared/api'
import {
  PLT_LOAD,
  PLT_LOAD_ERROR,
  PLT_SAVE,
  PLT_SAVE_ERROR,
  PLT_SAVE_FINISHED
} from 'state/actions/panel-layout-tool'

export const getPanelLayout = async () => {
  const { apis } = await getApiPVS()
  const response = await apis.panels.getPanelsLayout()
  const panels = pathOr([], ['body', 'body', 'result', 'panels'], response)
  return panels.map(panel =>
    utils.panelBuilder({
      id: panel.inverterSerialNumber,
      x: panel.xCoordinate,
      y: panel.yCoordinate,
      orientation: panel.planeRotation === 0 ? 'standing' : 'lying',
      groupKey: panel.inverterSerialNumber
    })
  )
}

export const savePanelLayout = async panels => {
  const { apis } = await getApiPVS()
  const transformed = panels.map(panel => ({
    inverterSerialNumber: panel.id,
    slope: null,
    xCoordinate: panel.x,
    yCoordinate: panel.y,
    planeRotation: panel.orientation === 'standing' ? 0 : 90,
    azimuth: null
  }))

  return await apis.panels.setPanelsLayout(
    {},
    {
      requestBody: {
        panels: transformed
      }
    }
  )
}

export const getPanelLayoutEpic = (action$, state$) =>
  action$.pipe(
    ofType(PLT_LOAD.getType()),
    exhaustMap(() =>
      from(getPanelLayout()).pipe(
        map(panels => actions.init(panels)),
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
        catchError(() => of(PLT_SAVE_ERROR.asError('PLT_SAVE_ERROR')))
      )
    )
  )

export default [getPanelLayoutEpic, savePanelLayoutEpic]
