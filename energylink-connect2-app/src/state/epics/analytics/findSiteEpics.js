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
import { renameKeys } from 'shared/utils'
import { compose, pick } from 'ramda'

/**
 * We need to race the actions so that we don't waste CPU by cancelling
 * the action in case the user selects a site or goes to create site
 * @param action$
 * @return {*}
 */
export const siteNotFoundEpic = action$ =>
  action$.pipe(
    ofType(NO_SITE_FOUND.getType()),
    switchMap(({ payload }) =>
      race(
        action$.pipe(
          ofType(SET_SITE.getType()),
          map(() => EMPTY_ACTION('SITE FOUND')),
          take(1)
        ),
        action$.pipe(
          ofType(HOME_SCREEN_CREATE_SITE.getType()),
          map(() => siteNotFound(payload)),
          take(1)
        )
      )
    )
  )

const siteKeysMap = {
  address1: 'Address',
  city: 'City',
  st_id: 'State',
  postalCode: 'Zip code',
  siteKey: 'Site ID',
  siteName: 'Site name'
}
const getSiteKey = compose(
  pick([
    'Address',
    'City',
    'State',
    'Zip code',
    'Site ID',
    'Site name',
    'Commissioned'
  ]),
  renameKeys(siteKeysMap)
)

export const siteFoundEpic = action$ =>
  action$.pipe(
    ofType(SET_SITE.getType()),
    switchMap(({ payload: siteData }) =>
      action$.pipe(
        ofType(GET_SITE_SUCCESS.getType()),
        map(({ payload: sitesPVS }) =>
          siteFound({
            ...getSiteKey(siteData),
            Commissioned: sitesPVS.length !== 0
          })
        ),
        take(1)
      )
    )
  )
export default [siteNotFoundEpic, siteFoundEpic]
