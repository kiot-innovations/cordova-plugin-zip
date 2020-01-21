import * as feedbackActions from '../../actions/feedback'

describe('resetFeedbackForm Epic', () => {
  let epicTest
  let resetFeedbackFormEpic

  beforeEach(() => {
    jest.resetModules()
    resetFeedbackFormEpic = require('./resetFeedbackForm').resetFeedbackFormEpic
    epicTest = epicTester(resetFeedbackFormEpic)
  })

  it('dispatches an RESET_FEEDBACK_FORM action if the feedback successfuly processed', () => {
    const inputValues = {
      a: feedbackActions.SEND_FEEDBACK_SUCCESS()
    }
    const expectedValues = {
      b: feedbackActions.RESET_FEEDBACK_FORM()
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })
})
