import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import PreCommissioning from './index'

describe('Precommissioning Checklist', () => {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const initialState = {
      global: {
        showPrecommissioningChecklist: true
      }
    }

    const { component } = mountWithProvider(<PreCommissioning />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
