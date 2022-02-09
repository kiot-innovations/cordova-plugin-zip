import moment from 'moment'
import { path } from 'ramda'
import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'

import { getApiParty } from 'shared/api'
import { translate } from 'shared/i18n'
import { getAccessToken } from 'shared/utils'
import * as feedbackActions from 'state/actions/feedback'

const getAPIMethods = path(['apis', 'default'])

const sendFeedbackPromise = (access_token, values) =>
  getApiParty(access_token)
    .then(getAPIMethods)
    .then(apiParty =>
      apiParty.post_v1_party_feedback({ id: 1 }, { requestBody: values })
    )

export const sendFeedbackEpic = (action$, state$) =>
  action$.pipe(
    ofType(feedbackActions.SEND_FEEDBACK_INIT.getType()),
    mergeMap(({ payload }) => {
      const t = translate(state$.value.language)
      const { comment, feature, rating, source } = payload
      const userEmail = path(['value', 'user', 'data', 'email'], state$)
      const userTime = moment().format('YYYY-MM-DDTHH:mm:ss')
      const feedbackEmail = {
        subject: feature
          ? t('FEATURE_FEEDBACK_SUBJECT', rating, source)
          : t('FEEDBACK_SUBJECT', rating),
        htmlBody: t('FEEDBACK_BODY', userEmail, userTime, comment)
      }

      const access_token = getAccessToken(state$.value)

      return from(sendFeedbackPromise(access_token, feedbackEmail)).pipe(
        map(({ status, data }) =>
          status === 200
            ? feedbackActions.SEND_FEEDBACK_SUCCESS({ rating, source })
            : feedbackActions.SEND_FEEDBACK_ERROR({ status, data })
        ),
        catchError(err => of(feedbackActions.SEND_FEEDBACK_ERROR(err)))
      )
    })
  )
