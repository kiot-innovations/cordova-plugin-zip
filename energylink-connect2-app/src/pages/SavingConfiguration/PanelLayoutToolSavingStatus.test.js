import React from 'react'
import * as reactRedux from 'react-redux'
import PanelLayoutToolSavingStatus from './PanelLayoutToolSavingStatus'
import * as i18n from 'shared/i18n'

describe('PanelLayoutToolSavingStatus component', () => {
  let dispatchMock

  const initialState = {
    pltWizard: {
      saving: true,
      saved: false,
      error: ''
    }
  }

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(fn => fn(initialState))
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<PanelLayoutToolSavingStatus />)({})
    expect(component).toMatchSnapshot()
  })
})
