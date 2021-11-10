import { shallow } from 'enzyme'
import React from 'react'

import QuickstartGuides from '.'

import * as i18n from 'shared/i18n'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    history: {
      goBack: jest.fn(),
      push: jest.fn()
    }
  })
}))

describe('QuickstartGuides component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const component = shallow(<QuickstartGuides />)
    expect(component).toMatchSnapshot()
  })
})
