import React from 'react'
import { shallow } from 'enzyme'
import * as i18n from 'shared/i18n'
import Toggler from '.'

describe('Toggler component', () => {
  beforeEach(() => {
    jest.spyOn(i18n, 'useI18n').mockImplementation(() => key => key)
  })
  test('render correctly', () => {
    const component = shallow(<Toggler text="Set autostart" checked={false} />)
    expect(component).toMatchSnapshot()
  })
})
