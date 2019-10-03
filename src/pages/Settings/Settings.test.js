import React from 'react'
import * as reactRedux from 'react-redux'
import { shallow } from 'enzyme'
import Settings from '.'
import * as i18n from '../../shared/i18n'

describe('Settings page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })
  it('renders without crashing', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => 'CONNECTED')
    const component = shallow(<Settings />)
    expect(component).toMatchSnapshot()
  })
})
