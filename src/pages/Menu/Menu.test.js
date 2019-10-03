import React from 'react'
import { shallow } from 'enzyme'
import Menu from '.'
import * as i18n from '../../shared/i18n'

describe('Menu page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })
  it('renders without crashing', () => {
    const component = shallow(<Menu />)
    expect(component).toMatchSnapshot()
  })
})
