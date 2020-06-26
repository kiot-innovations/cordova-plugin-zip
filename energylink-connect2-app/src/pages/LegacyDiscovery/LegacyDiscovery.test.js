import React from 'react'
import * as ReactDOM from 'react-dom'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import LegacyDiscovery from '.'

describe('Legacy Discovery Results page', () => {
  let dispatchMock

  let initialState = {
    devices: {
      claimingDevices: false,
      claimError: '',
      claimedDevices: false,
      found: [],
      progress: []
    }
  }

  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element
    })
  })

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          push: jest.fn()
        }
      })
    }))
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<LegacyDiscovery />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
