import { ofType } from 'redux-observable'
import {
  GET_SITE_ERROR,
  GET_SITE_SUCCESS,
  HOME_SCREEN_CREATE_SITE,
  NO_SITE_FOUND,
  SET_SITE
} from 'state/actions/site'
import { map, switchMap, take } from 'rxjs/operators'
import { EMPTY, race } from 'rxjs'
import { siteFound, siteNotFound } from 'shared/analytics'

/**
 * We need to race the actions so that we don't waste CPU by cancelling
 * the action in case the user selects a site or goes to create site
 * @param action$
 * @param state$ The actual redux state
 * @return {*}
 */
export const siteNotFoundEpic = (action$, state$) =>
  action$.pipe(
    ofType(NO_SITE_FOUND.getType()),
    switchMap(() =>
      race(
        action$.pipe(
          ofType(SET_SITE.getType()),
          switchMap(() => EMPTY),
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
      race(
        action$.pipe(
          ofType(GET_SITE_SUCCESS.getType()),
          map(({ payload: sitesPVS }) =>
            siteFound(state$.value.user.data, {
              ...siteData,
              commissioned: sitesPVS.length !== 0
            })
          ),
          take(1)
        ),
        action$.pipe(
          ofType(GET_SITE_ERROR.getType()),
          map(() => siteFound(state$.value.user.data, siteData)),
          take(1)
        )
      )
    )
  )
export default [siteNotFoundEpic, siteFoundEpic]
