import React from 'react'
import { shallow } from 'enzyme'
import RightNow from '.'
import * as i18n from '../../shared/i18n'

describe('Right Now component', () => {
  const previousLocation = {
    pathname: '/'
  }

  it('renders without crashing', () => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => key => key.toUpperCase())
    const component = shallow(
      <RightNow
        solarValue={2.5}
        gridValue={2.5}
        storageValue={2.5}
        homeValue={2.5}
        batteryLevel={63}
        location={previousLocation}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
