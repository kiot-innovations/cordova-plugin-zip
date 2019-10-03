import * as i18n from '../../shared/i18n'
import { shallow } from 'enzyme/build'

import React from 'react'
import BatterySystemStatus from './index'

describe('Battery System Status component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(
      <BatterySystemStatus internet={true} offgrid={true} />
    )
    expect(component).toMatchSnapshot()
  })

  it('renders with warning without crashing', () => {
    const component = shallow(
      <BatterySystemStatus internet={true} offgrid={true} warning={true} />
    )
    expect(component).toMatchSnapshot()
  })
})
