import { ofType } from 'redux-observable'
import { of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

import { feedbackSent } from 'shared/analytics'
import {
  SEND_FEEDBACK_SUCCESS,
  RESET_FEEDBACK_FORM
} from 'state/actions/feedback'

export const resetFeedbackFormEpic = action$ =>
  action$.pipe(
    ofType(SEND_FEEDBACK_SUCCESS.getType()),
    switchMap(({ payload: { rating = 0, source = '' } }) =>
      of(RESET_FEEDBACK_FORM(), feedbackSent({ rating, source }))
    )
  )
