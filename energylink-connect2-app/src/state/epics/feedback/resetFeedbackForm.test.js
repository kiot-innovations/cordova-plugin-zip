import * as feedbackActions from '../../actions/feedback'

import { MIXPANEL_EVENT_QUEUED } from 'state/actions/analytics'

describe('resetFeedbackForm Epic', () => {
  let epicTest
  let resetFeedbackFormEpic

  beforeEach(() => {
    jest.resetModules()
    resetFeedbackFormEpic = require('./resetFeedbackForm').resetFeedbackFormEpic
    epicTest = epicTester(resetFeedbackFormEpic)
    window.mixpanel = {
      track: jest.fn(() => {})
    }
  })

  it('dispatches RESET_FEEDBACK_FORM and MIXPANEL_EVENT_QUEUED actions if the feedback is successfully processed', () => {
    const inputValues = {
      a: feedbackActions.SEND_FEEDBACK_SUCCESS({ rating: 4, source: 'Menu' })
    }
    const expectedValues = {
      b: feedbackActions.RESET_FEEDBACK_FORM(),
      m: MIXPANEL_EVENT_QUEUED('Feedback Sent')
    }

    const inputMarble = 'a'
    const expectedMarble = '(bm)'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })
})
