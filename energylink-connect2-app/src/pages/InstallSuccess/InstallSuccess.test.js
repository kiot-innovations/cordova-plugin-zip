import React from 'react'
import * as ReactDOM from 'react-dom'

import InstallSuccessful from 'pages/InstallSuccess'
import * as i18n from 'shared/i18n'

describe('PVS connection successful component', () => {
  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element
    })
  })

  afterEach(() => {
    ReactDOM.createPortal.mockClear()
  })
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          push: jest.fn()
        }
      })
    }))
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<InstallSuccessful />)({})
    expect(component).toMatchSnapshot()
  })
})
