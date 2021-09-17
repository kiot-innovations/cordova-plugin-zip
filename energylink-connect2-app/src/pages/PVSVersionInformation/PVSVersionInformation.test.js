import { shallow } from 'enzyme'
import React from 'react'

import PVSVersionInformation from '.'

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
    const component = shallow(
      <PVSVersionInformation currentVersion="6.118.0" />
    )
    expect(component).toMatchSnapshot()
  })
})
