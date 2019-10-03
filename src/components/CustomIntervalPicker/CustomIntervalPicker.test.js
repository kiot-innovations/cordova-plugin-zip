import React from 'react'
import { shallow } from 'enzyme'
import * as i18n from '../../shared/i18n'

import CustomIntervalPicker from '.'

describe('CustomIntervalPicker Component', () => {
  beforeEach(() => {
    jest.spyOn(i18n, 'useI18n').mockImplementation(path => key => key)
  })

  it('renders without crashing', () => {
    const component = shallow(<CustomIntervalPicker />)
    expect(component).toMatchSnapshot()
  })
})
