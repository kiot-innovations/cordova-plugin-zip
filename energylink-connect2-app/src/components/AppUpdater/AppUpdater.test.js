import { shallow } from 'enzyme'
import React from 'react'

import AppUpdater from '.'

import * as i18n from 'shared/i18n'

describe('AppUpdater Component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly', () => {
    const component = shallow(<AppUpdater />)
    expect(component).toMatchSnapshot()
  })

  test('Runs the update fn when pressing the button', () => {
    const onUpdate = jest.fn()
    const component = shallow(<AppUpdater onUpdate={onUpdate} />)
    component.find('button.is-primary').simulate('click')
    expect(onUpdate.mock.calls.length).toBe(1)
  })
})
