import { shallow } from 'enzyme'
import React from 'react'

import KnowledgeBase from '.'

import * as i18n from 'shared/i18n'

describe('KnowledgeBase component', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          goBack: jest.fn()
        }
      })
    }))
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const component = shallow(<KnowledgeBase />)
    expect(component).toMatchSnapshot()
  })
})
