import React from 'react'
import { shallow } from 'enzyme'
import LifetimeSavings from '.'
import * as i18n from '../../shared/i18n'

describe('Lifetime Savings component', () => {
  it('renders without crashing', () => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    const value = 1000
    const component = shallow(<LifetimeSavings value={value} />)
    expect(component).toMatchSnapshot()
  })
})
