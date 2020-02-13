import React from 'react'
import * as reactRedux from 'react-redux'
import SavingConfiguration from '.'
import * as i18n from 'shared/i18n'

describe('SavingConfiguration component', () => {
  let dispatchMock

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
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          push: jest.fn()
        }
      })
    }))
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<SavingConfiguration />)({})
    expect(component).toMatchSnapshot()
  })
})
