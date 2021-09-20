import React from 'react'

import AnalyticsConsent from '.'

import * as i18n from 'shared/i18n'

const mock = jest.fn()
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    goBack: mock
  })
}))

describe('AnalyticsConsent page', () => {
  const store = {
    permissions: {
      trackingPermission: 1
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<AnalyticsConsent />)(store)
    expect(component).toMatchSnapshot()
  })

  test('runs the OK button fn', () => {
    const { component } = mountWithProvider(<AnalyticsConsent />)({
      permissions: {
        trackingPermission: 1
      }
    })

    const okMock = jest.fn()
    window.cordova = {
      plugins: {
        diagnostic: {
          switchToSettings: okMock
        }
      }
    }

    component.find('button.is-primary.is-fullwidth.ml-10').simulate('click')
    expect(okMock).toBeCalled()
  })

  test('runs the CLOSE APP button fn', () => {
    const { component } = mountWithProvider(<AnalyticsConsent />)(store)

    const closeMock = jest.fn()
    navigator.app = {
      exitApp: closeMock
    }

    component
      .find('button.is-primary.is-outlined.is-fullwidth.mr-10')
      .simulate('click')
    expect(closeMock).toBeCalled()
  })

  test('runs goBack if tracking permissions is AUTHORIZED', () => {
    const goBackMock = jest.fn()
    window.history.goBack = goBackMock

    mountWithProvider(<AnalyticsConsent />)({
      permissions: {
        trackingPermission: 3
      }
    })

    expect(mock).toBeCalled()
  })
})
