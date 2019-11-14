import React from 'react'
import { shallow } from 'enzyme'
import PvsConnectionSuccessful from '.'
import * as i18n from 'shared/i18n'

describe('PVS connection successful component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = shallow(<PvsConnectionSuccessful />)
    expect(component).toMatchSnapshot()
  })
})
