import { shallow } from 'enzyme'
import React from 'react'
import * as reactRedux from 'react-redux'

import OtherDevicesList, {
  RetryDiscovery
} from 'pages/StringInverters/OtherDevicesList'
import * as i18n from 'shared/i18n'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}))

describe('The main OtherDevices component', function() {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('should render correctly', function() {
    const component = shallow(<RetryDiscovery />)
    expect(component).toMatchSnapshot()
  })
})

describe('The small components of the page', function() {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })
  describe('The RetryDiscovery component', function() {
    it('should render correctly', function() {
      const component = mountWithProvider(<OtherDevicesList />)({
        devices: {
          found: []
        }
      })
      expect(component).toMatchSnapshot()
    })
  })
})
