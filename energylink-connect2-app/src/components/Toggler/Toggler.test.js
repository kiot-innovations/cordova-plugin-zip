import { shallow } from 'enzyme'
import React from 'react'

import Toggler from '.'

import * as i18n from 'shared/i18n'

describe('Toggler component', () => {
  beforeEach(() => {
    jest.spyOn(i18n, 'useI18n').mockImplementation(() => key => key)
  })
  test('render correctly', () => {
    const component = shallow(<Toggler text="Set autostart" checked={false} />)
    expect(component).toMatchSnapshot()
  })
})
