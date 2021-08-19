import { shallow } from 'enzyme'
import React from 'react'

import Collapsible from '.'

import * as i18n from 'shared/i18n'

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

  test('Renders Correctly when expanded', () => {
    const component = shallow(
      <Collapsible expanded>
        <p>CONTENT_EXPANDED</p>
      </Collapsible>
    )
    expect(component).toMatchSnapshot()
  })

  test('Expands Correctly', () => {
    const component = shallow(<Collapsible />)
    component.find('.collapsible-trigger').simulate('click')
    expect(component.find('.expanded').length).toBe(1)
  })
})
