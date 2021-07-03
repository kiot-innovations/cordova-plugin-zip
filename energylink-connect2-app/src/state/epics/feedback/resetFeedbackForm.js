import { ofType } from 'redux-observable'
import { switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import {
  SEND_FEEDBACK_SUCCESS,
  RESET_FEEDBACK_FORM
} from 'state/actions/feedback'
import { feedbackSent } from 'shared/analytics'

export const resetFeedbackFormEpic = action$ =>
  action$.pipe(
    ofType(SEND_FEEDBACK_SUCCESS.getType()),
    switchMap(({ payload: { rating = 0, source = '' } }) =>
      of(RESET_FEEDBACK_FORM(), feedbackSent({ rating, source }))
    )
  )
