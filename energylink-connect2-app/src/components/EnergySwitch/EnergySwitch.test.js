import { shallow } from 'enzyme'
import React from 'react'

import * as i18n from '../../shared/i18n'

import EnergySwitch from '.'

describe('Energy switch', () => {
  it('renders without crashing', () => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    const component = shallow(<EnergySwitch />)
    expect(component).toMatchSnapshot()
  })
})
