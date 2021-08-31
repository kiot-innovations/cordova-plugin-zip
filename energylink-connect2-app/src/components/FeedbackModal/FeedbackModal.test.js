import { shallow } from 'enzyme'
import React from 'react'

import FeedbackModal from '.'

import * as i18n from 'shared/i18n'

describe('FeedbackModal Component', () => {
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
