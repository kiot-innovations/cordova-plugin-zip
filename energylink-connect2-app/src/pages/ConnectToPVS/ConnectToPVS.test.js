import React from 'react'
import { shallow } from 'enzyme'
import ConnectToPVS from '.'
import * as i18n from 'shared/i18n'

describe('Connect to PVS page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = shallow(<ConnectToPVS />)
    expect(component).toMatchSnapshot()
  })
})
