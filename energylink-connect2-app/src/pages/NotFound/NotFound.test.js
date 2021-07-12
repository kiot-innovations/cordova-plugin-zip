import { shallow } from 'enzyme'
import React from 'react'

import NotFound from '.'

import * as i18n from 'shared/i18n'

describe('NotFound Page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = shallow(<NotFound />)
    expect(component).toMatchSnapshot()
  })
})
