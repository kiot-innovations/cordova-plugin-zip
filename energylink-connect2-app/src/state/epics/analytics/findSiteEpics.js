import { pathOr } from 'ramda'
import { ofType } from 'redux-observable'
import { EMPTY, race, of } from 'rxjs'
import { map, switchMap, take } from 'rxjs/operators'

import { siteFound, siteNotFound, createSite } from 'shared/analytics'
import {
  GET_SITE_ERROR,
  GET_SITE_SUCCESS,
  HOME_SCREEN_CREATE_SITE,
  NO_SITE_FOUND,
  SET_SITE,
  CREATE_SITE_SUCCESS,
  CREATE_SITE_ERROR
} from 'state/actions/site'

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

const commissioningStatus = {
  UNKNOWN: 'Unknown',
  COMMISSIONED: 'Commissioned',
  NOT_COMMISSIONED: 'Not Commissioned'
}

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
              commissioningStatus:
                sitesPVS.length !== 0
                  ? commissioningStatus.COMMISSIONED
                  : commissioningStatus.NOT_COMMISSIONED
            })
          ),
          take(1)
        ),
        action$.pipe(
          ofType(GET_SITE_ERROR.getType()),
          map(() =>
            siteFound(state$.value.user.data, {
              ...siteData,
              commissioningStatus: commissioningStatus.UNKNOWN
            })
          ),
          take(1)
        )
      )
    )
  )

export const createSiteEpic = (action$, state$) =>
  action$.pipe(
    ofType(CREATE_SITE_SUCCESS.getType(), CREATE_SITE_ERROR.getType()),
    switchMap(({ type, payload }) => {
      if (type === CREATE_SITE_ERROR.getType()) {
        const error = pathOr(
          'Unknown error.',
          ['response', 'body', 'message'],
          payload
        )

        return of(createSite({ success: false, error }))
      }

      return of(createSite({ success: true }))
    })
  )

export default [siteNotFoundEpic, siteFoundEpic, createSiteEpic]
