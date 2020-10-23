import { ofType } from 'redux-observable'
import {
  GET_SITE_SUCCESS,
  HOME_SCREEN_CREATE_SITE,
  NO_SITE_FOUND,
  SET_SITE
} from 'state/actions/site'
import { map, switchMap, take } from 'rxjs/operators'
import { race } from 'rxjs'
import { EMPTY_ACTION } from 'state/actions/share'
import { siteFound, siteNotFound } from 'shared/analytics'

/**
 * We need to race the actions so that we don't waste CPU by cancelling
 * the action in case the user selects a site or goes to create site
 * @param action$
 * @return {*}
 */
export const siteNotFoundEpic = (action$, state$) =>
  action$.pipe(
    ofType(NO_SITE_FOUND.getType()),
    switchMap(() =>
      race(
        action$.pipe(
          ofType(SET_SITE.getType()),
          map(() => EMPTY_ACTION('SITE FOUND')),
          take(1)
        ),
        action$.pipe(
          ofType(HOME_SCREEN_CREATE_SITE.getType()),
          map(() => siteNotFound(state$.value.user.data)),
          take(1)
        )
      )
    )
  )

export const siteFoundEpic = (action$, state$) =>
  action$.pipe(
    ofType(SET_SITE.getType()),
    switchMap(({ payload: siteData }) =>
      action$.pipe(
        ofType(GET_SITE_SUCCESS.getType()),
        map(({ payload: sitesPVS }) =>
          siteFound(state$.value.user.data, {
            ...siteData,
            commissioned: sitesPVS.length !== 0
          })
        ),
        take(1)
      )
    )
  )
export default [siteNotFoundEpic, siteFoundEpic]
