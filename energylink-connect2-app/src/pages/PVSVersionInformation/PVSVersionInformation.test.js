import React from 'react'
import PVSVersionInformation from '.'
import { shallow } from 'enzyme'
import * as i18n from 'shared/i18n'

describe('PVS Version Information page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = shallow(<PVSVersionInformation />)
    expect(component).toMatchSnapshot()
  })
})
