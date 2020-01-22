import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'
import * as feedbackActions from '../../actions/feedback'
import { path } from 'ramda'
import moment from 'moment'
import { getApiParty } from 'shared/api'
import { translate } from 'shared/i18n'
import { postParams } from 'shared/fetch'

export const postFeedback = async (postData, state) => {
  if (state !== null) {
    try {
      const swagger = await getApiParty(state.user.auth.access_token)
      return swagger.apis.default.post_v1_party_feedback(postData)
    } catch (err) {
      return console.error(err)
    }
  }
}

export const sendFeedbackEpic = (action$, state$) =>
  action$.pipe(
    ofType(feedbackActions.SEND_FEEDBACK_INIT.getType()),
    mergeMap(({ payload }) => {
      const t = translate(state$.value.language)
      const bodyValues = {
        ...payload,
        contactEmail: path(['value', 'user', 'data', 'email'], state$),
        userstime: moment().format('YYYY-MM-DDTHH:mm:ss')
      }
      const values = {
        subject: t("FEEDBACK_SUBJECT", bodyValues.rating),
        htmlBody: t('FEEDBACK_BODY', bodyValues.contactEmail, bodyValues.userstime, bodyValues.comment)
      }

      const postValues = postParams(values)

      return from(postFeedback(postValues, state$.value)).pipe(
        map(({ status, data }) =>
          status === 200
            ? feedbackActions.SEND_FEEDBACK_SUCCESS()
            : feedbackActions.SEND_FEEDBACK_ERROR({ status, data })
        ),
        catchError(err => of(feedbackActions.SEND_FEEDBACK_ERROR(err)))
      )
    })
  )
