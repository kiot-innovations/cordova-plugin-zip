import React from 'react'
import { shallow } from 'enzyme'
import * as i18n from 'shared/i18n'
import FeedbackModal from '.'

describe('FeedbackModal Component', () => {
  const text = 'Test text'

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly', () => {
    const component = shallow(<FeedbackModal />)
    expect(component).toMatchSnapshot()
  })
})
