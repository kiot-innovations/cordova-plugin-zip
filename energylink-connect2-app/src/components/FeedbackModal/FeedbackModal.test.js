import { shallow } from 'enzyme'
import React from 'react'
import * as reactRedux from 'react-redux'

import FeedbackModal from '.'

import * as i18n from 'shared/i18n'

describe('FeedbackModal component', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = shallow(
      <FeedbackModal
        open={true}
        onRatingChange={() => {}}
        onChange={() => {}}
        rating={3}
        feedbackSent={false}
        handleFeedbackSuccess={() => {}}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
