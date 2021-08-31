import { shallow } from 'enzyme'
import React from 'react'

import { ButtonLink } from '.'

import * as i18n from 'shared/i18n'

describe('ButtonLink Component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly', () => {
    const component = shallow(<ButtonLink />)
    expect(component).toMatchSnapshot()
  })

  test('Runs the click fn when pressing the button', () => {
    const onClick = jest.fn()
    const component = shallow(<ButtonLink onClick={onClick} />)
    component.find('.button-link').simulate('click')
    expect(onClick.mock.calls.length).toBe(1)
  })
})
