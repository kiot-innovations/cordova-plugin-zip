import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'
import * as feedbackActions from '../../actions/feedback'
import { path } from 'ramda'
import moment from 'moment'
import { getApiParty } from 'shared/api'

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
      const bodyValues = {
        ...payload,
        contactEmail: path(['value', 'user', 'data', 'email'], state$),
        userstime: moment().format('YYYY-MM-DDTHH:mm:ss')
      }
      const values = {
        subject: `Recieved ${bodyValues.rating} star rating from EnergyLink Connect 2 feedback form`,
        htmlBody: `From ${bodyValues.contactEmail} at ${bodyValues.userstime}: ${bodyValues.comment}`
      }

      const postParams = Object.keys(values).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
      }).join('&');

      return from(postFeedback(postParams, state$.value)).pipe(
        map(({ status, data }) =>
          status === 200
            ? feedbackActions.SEND_FEEDBACK_SUCCESS()
            : feedbackActions.SEND_FEEDBACK_ERROR({ status, data })
        ),
        catchError(err => of(feedbackActions.SEND_FEEDBACK_ERROR(err)))
      )
    })
  )
