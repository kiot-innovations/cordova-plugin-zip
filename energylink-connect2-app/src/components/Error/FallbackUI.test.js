import { shallow } from 'enzyme'
import React from 'react'

import FallbackUI from './FallbackUI'

import * as i18n from 'shared/i18n'

describe('FallbackUI component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  const error = {
    message: 'TypeError: something bad happened'
  }

  test('render correctly when error', () => {
    const component = shallow(<FallbackUI error={error} />)
    expect(component).toMatchSnapshot()
  })

  test('render correctly when no error', () => {
    const component = shallow(<FallbackUI />)
    expect(component).toMatchSnapshot()
  })
})
