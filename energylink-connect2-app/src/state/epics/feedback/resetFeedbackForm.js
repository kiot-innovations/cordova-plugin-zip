import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'
import * as feedbackActions from '../../actions/feedback'

export const resetFeedbackFormEpic = action$ =>
  action$.pipe(
    ofType(feedbackActions.SEND_FEEDBACK_SUCCESS.getType()),
    map(() => feedbackActions.RESET_FEEDBACK_FORM())
  )
