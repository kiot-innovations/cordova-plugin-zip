import InstallSuccessful from 'pages/InstallSuccess'
import React from 'react'
import * as i18n from 'shared/i18n'
import * as ReactDOM from 'react-dom'
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
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<InstallSuccessful />)({
      history: {
        push: jest.fn()
      }
    })
    expect(component).toMatchSnapshot()
  })
})
