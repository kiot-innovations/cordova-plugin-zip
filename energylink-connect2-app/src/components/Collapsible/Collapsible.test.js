import React from 'react'
import { shallow } from 'enzyme'
import * as i18n from 'shared/i18n'
import Collapsible from '.'

describe('Collapsible Component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly', () => {
    const component = shallow(<Collapsible />)
    expect(component).toMatchSnapshot()
  })

  test('Expands Correctly', () => {
    const component = shallow(<Collapsible />)
    component.find('.chevron').simulate('click')
    expect(component.find('.expanded').length).toBe(1)
  })
})
