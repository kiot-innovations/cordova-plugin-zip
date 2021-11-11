import React from 'react'
import * as reactRedux from 'react-redux'

import SavingConfiguration from '.'

import * as i18n from 'shared/i18n'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
    block: jest.fn()
  })
}))

describe('SavingConfiguration component', () => {
  let dispatchMock
  const historyMock = { block: jest.fn() }

  const initialState = {
    submit: {
      submitting: true,
      submitted: false,
      error: ''
    }
  }

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => initialState)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(
      <SavingConfiguration history={historyMock} />
    )({})
    expect(component).toMatchSnapshot()
  })

  test('properly renders commissioning error', () => {
    const mockedStore = {
      systemConfiguration: {
        submit: {
          error: 'This is an error'
        }
      }
    }

    const { component } = mountWithProvider(
      <SavingConfiguration history={historyMock} />
    )(mockedStore)
    expect(component.find('.error-message')).toHaveLength(1)
  })
})
