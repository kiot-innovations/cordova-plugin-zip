import * as Sentry from '@sentry/browser'
import { ofType } from 'redux-observable'
import { from, of } from 'rxjs'
import {
  catchError,
  exhaustMap,
  map,
  switchMap,
  tap,
  filter as filterX,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators'
import {
  compose,
  equals,
  filter,
  map as mapR,
  path,
  pathOr,
  prop,
  join,
  values,
  pick
} from 'ramda'
import * as siteActions from 'state/actions/site'
import * as devicesActions from 'state/actions/devices'
import { getApiSite, getApiSearch } from 'shared/api'
import { EMPTY_ACTION } from 'state/actions/share'
import { cleanString } from 'shared/utils'

const getAccessToken = path(['user', 'auth', 'access_token'])

const formatAddress = compose(
  join(', '),
  values,
  pick(['st_addr_lbl', 'city_id', 'cntrc_no'])
)

const buildSelectValue = value => ({
  label: formatAddress(value),
  value: value.site_key,
  site: value
})

const accessValue = compose(buildSelectValue, prop('_source'))

const getSitesByText = (text, access_token) =>
  getApiSearch(access_token)
    .then(path(['apis', 'default']))
    .then(api =>
      api.get_v1_search_index__indexId_({
        indexId: 'site',
        q: text,
        pg: 1
      })
    )
    .then(pathOr([], ['body', 'items', 'hits']))
    .then(mapR(accessValue))

export const fetchSitesEpic = (action$, state$) => {
  let setResults
  return action$.pipe(
    ofType(siteActions.GET_SITES_INIT.getType()),
    tap(({ payload: { onResults } }) => (setResults = onResults)),
    map(path(['payload', 'value'])),
    map(cleanString),
    filterX(text => text.trim().length > 1),
    debounceTime(1000),
    distinctUntilChanged(),
    exhaustMap(text =>
      from(getSitesByText(text, getAccessToken(state$.value))).pipe(
        map(sites => {
          setResults(sites)
          return sites.length === 0
            ? siteActions.NO_SITE_FOUND(text)
            : EMPTY_ACTION()
        }),
        catchError(error => {
          setResults([])
          Sentry.captureException(error)
          return of(siteActions.NO_SITE_FOUND(text))
        })
      )
    )
  )
}

export const fetchSiteData = (action$, state$) => {
  const filterPVS = filter(compose(equals('DATALOGGER'), prop('deviceType')))

  async function getSiteDataPromise(accessToken, siteKey = '') {
    const api = await getApiSite(accessToken)
    const res = await api.apis.default.get_v1_site_assignment({ siteKey })
    return JSON.parse(res.data)
  }

  return action$.pipe(
    ofType(siteActions.GET_SITE_INIT.getType()),
    exhaustMap(({ payload }) =>
      from(getSiteDataPromise(getAccessToken(state$.value), payload)).pipe(
        switchMap(siteData =>
          of(
            siteActions.GET_SITE_SUCCESS(filterPVS(siteData)),
            devicesActions.FETCH_DEVICES_LIST()
          )
        ),
        catchError(error => {
          Sentry.captureException(error)
          return of(
            siteActions.GET_SITE_ERROR({ message: 'ERROR GETTING SITE' })
          )
        })
      )
    )
  )
}

async function getSiteInfoPromise(accessToken, siteId = '') {
  const api = await getApiSite(accessToken)
  const getSite = path(['apis', '/v1', 'getSite'], api)
  if (!getSite) throw new Error('NOT_IMPLEMENTED')
  const res = await getSite({ siteKey: siteId })
  return res.body
}

export const fetchSiteInfo = (action$, state$) => {
  return action$.pipe(
    ofType(siteActions.ON_GET_SITE_INFO.getType()),
    exhaustMap(({ payload }) =>
      from(getSiteInfoPromise(getAccessToken(state$.value), payload)).pipe(
        tap(e => console.info({ e })),
        map(siteInfo =>
          siteActions.ON_GET_SITE_INFO_END({
            error: false,
            contractNumber: pathOr(
              'N/A',
              ['energyContracts', '0', 'contractNumber'],
              siteInfo
            ),
            financeType: pathOr(
              'N/A',
              ['energyContracts', '0', 'financeType'],
              siteInfo
            )
          })
        ),
        catchError(error => {
          Sentry.captureException(error)
          return of(
            siteActions.ON_GET_SITE_INFO_END({
              error: true,
              message: error.message
            })
          )
        })
      )
    )
  )
}
