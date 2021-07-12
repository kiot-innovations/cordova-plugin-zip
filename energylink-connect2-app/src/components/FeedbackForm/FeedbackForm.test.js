import { shallow } from 'enzyme'
import React from 'react'
import * as reactRedux from 'react-redux'

import FeedbackForm from '.'

import * as i18n from 'shared/i18n'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}))

describe('FeedbackForm component', () => {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = shallow(
      <FeedbackForm
        title={'RATE_APP'}
        placeholder={'GIVE_FEEDBACK_PAGE_PLACEHOLDER'}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
