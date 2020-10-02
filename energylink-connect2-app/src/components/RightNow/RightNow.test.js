import React from 'react'
import { mount, shallow } from 'enzyme'
import RightNow from '.'
import * as i18n from '../../shared/i18n'

describe('Right Now component', () => {
  const previousLocation = {
    pathname: '/'
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => key => key.toUpperCase())
  })

  it('renders without crashing', () => {
    const component = shallow(
      <RightNow
        solarAvailable
        solarValue={2.5}
        gridValue={2.5}
        storageValue={2.5}
        homeValue={2.5}
        batteryLevel={63}
        hasStorage={true}
        location={previousLocation}
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('renders with disabled storage square', () => {
    const component = mount(
      <RightNow
        solarAvailable
        solarValue={2.5}
        gridValue={2.5}
        storageValue={0}
        homeValue={2.5}
        hasStorage={false}
        batteryLevel={0}
        location={previousLocation}
      />
    )

    expect(component.find('.disabled-filter').length).toBe(1)
    component.unmount()
  })
  it('renders without solar', () => {
    const component = shallow(
      <RightNow
        solarAvailable={false}
        gridValue={2.5}
        storageValue={2.5}
        homeValue={2.5}
        batteryLevel={63}
        hasStorage={true}
        location={previousLocation}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
