import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'
import * as feedbackActions from 'state/actions/feedback'
import { path } from 'ramda'
import moment from 'moment'
import { translate } from 'shared/i18n'
import { getApiParty } from 'shared/api'
import { getAccessToken } from 'shared/utils'

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
      const { comment, rating, source } = payload
      const bodyValues = {
        rating,
        comment,
        contactEmail: path(['value', 'user', 'data', 'email'], state$),
        userstime: moment().format('YYYY-MM-DDTHH:mm:ss')
      }
      const values = {
        subject: t('FEEDBACK_SUBJECT', bodyValues.rating),
        htmlBody: t(
          'FEEDBACK_BODY',
          bodyValues.contactEmail,
          bodyValues.userstime,
          bodyValues.comment
        )
      }

      const access_token = getAccessToken(state$.value)

      return from(sendFeedbackPromise(access_token, values)).pipe(
        map(({ status, data }) =>
          status === 200
            ? feedbackActions.SEND_FEEDBACK_SUCCESS({ rating, source })
            : feedbackActions.SEND_FEEDBACK_ERROR({ status, data })
        ),
        catchError(err => of(feedbackActions.SEND_FEEDBACK_ERROR(err)))
      )
    })
  )
