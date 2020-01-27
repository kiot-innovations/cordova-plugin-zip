import * as feedbackActions from '../../actions/feedback'
import { throwError } from 'rxjs'

describe('sendFeedback Epic', () => {
  const mockData = { some: 'data' }
  const fetchMock = {}
  let epicTest
  let sendFeedbackEpic

  beforeEach(() => {
    jest.resetModules()
    jest.doMock('../../../shared/fetch', () => fetchMock)
    sendFeedbackEpic = require('./sendFeedback').sendFeedbackEpic
    epicTest = epicTester(sendFeedbackEpic)
    const baseTime = new Date(1566965470759) // Aug 27 2019 23:11:10 GMT-0500
    jest.spyOn(Date, 'now').mockImplementation(() => baseTime)
  })

  it('dispatches a SEND_FEEDBACK_SUCCESS action if the feedback successfuly processed', () => {
    fetchMock.postFeedback = () => [{ status: 200 }]
    const inputValues = {
      a: feedbackActions.SEND_FEEDBACK_INIT({
        rating: 3,
        comment: 'some comments'
      })
    }
    const expectedValues = {
      b: feedbackActions.SEND_FEEDBACK_SUCCESS()
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })

  it('dispatches a SEND_FEEDBACK_ERROR action if the feedback call is unsuccessful', () => {
    fetchMock.postFeedback = () => [{ status: 400, data: mockData }]

    const inputValues = {
      a: feedbackActions.SEND_FEEDBACK_INIT({
        rating: 3,
        comment: 'some comments'
      })
    }
    const expectedValues = {
      b: feedbackActions.SEND_FEEDBACK_ERROR({ status: 400, data: mockData })
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })

  it('dispatches a SEND_FEEDBACK_ERROR action if the feedback call throws exception', () => {
    const error = new Error('something happened!')
    fetchMock.postFeedback = () => throwError(error)
    const inputValues = {
      a: feedbackActions.SEND_FEEDBACK_INIT({
        rating: 3,
        comment: 'some comments'
      })
    }
    const expectedValues = {
      b: feedbackActions.SEND_FEEDBACK_ERROR(error)
    }

    const inputMarble = 'a'
    const expectedMarble = 'b'

    epicTest(inputMarble, expectedMarble, inputValues, expectedValues)
  })
})
