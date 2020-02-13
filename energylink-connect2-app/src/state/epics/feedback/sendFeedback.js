import { ofType } from 'redux-observable'
import { of, from } from 'rxjs'
import { mergeMap, map, catchError } from 'rxjs/operators'
import * as feedbackActions from 'state/actions/feedback'
import { path } from 'ramda'
import moment from 'moment'
import { translate } from 'shared/i18n'
import { encodedParams, postEncodedBody } from 'shared/fetch'

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
        subject: t('FEEDBACK_SUBJECT', bodyValues.rating),
        htmlBody: t(
          'FEEDBACK_BODY',
          bodyValues.contactEmail,
          bodyValues.userstime,
          bodyValues.comment
        )
      }

      const postValues = encodedParams(values)

      return from(postEncodedBody(postValues, state$.value)).pipe(
        map(({ status, data }) =>
          status === 200
            ? feedbackActions.SEND_FEEDBACK_SUCCESS()
            : feedbackActions.SEND_FEEDBACK_ERROR({ status, data })
        ),
        catchError(err => of(feedbackActions.SEND_FEEDBACK_ERROR(err)))
      )
    })
  )
