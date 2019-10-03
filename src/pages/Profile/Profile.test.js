import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import * as i18n from '../../shared/i18n'
import Profile from '.'

describe('Profile page', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(<Profile />)
    expect(component).toMatchSnapshot()
  })
})
