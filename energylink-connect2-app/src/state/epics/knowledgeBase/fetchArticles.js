import { includes, prop } from 'ramda'
import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { catchError, exhaustMap, map } from 'rxjs/operators'
import * as Sentry from 'sentry-cordova'

import { zendeskApi } from 'shared/api'
import { TAGS } from 'shared/utils'
import {
  UPDATE_ARTICLES,
  UPDATE_ARTICLES_SUCCESS,
  UPDATE_ARTICLES_ERROR
} from 'state/actions/knowledgeBase'

export const fetchArticlesEpic = action$ =>
  action$.pipe(
    ofType(UPDATE_ARTICLES.getType()),
    exhaustMap(() => {
      return zendeskApi.fetchArticles().pipe(
        map(response => {
          const articles = prop('articles', response)
          const filteredArticles = articles.filter(article =>
            includes('production', article.label_names)
          )
          return UPDATE_ARTICLES_SUCCESS(filteredArticles)
        }),
        catchError(err => {
          Sentry.setTag(
            TAGS.KEY.THIRD_PARTY_SERVICE,
            TAGS.VALUE.GET_ZENDESK_ARTICLES
          )
          Sentry.captureMessage(`${err.message} - fetchArticles.js`)
          Sentry.captureException(err)
          return of(UPDATE_ARTICLES_ERROR())
        })
      )
    })
  )
