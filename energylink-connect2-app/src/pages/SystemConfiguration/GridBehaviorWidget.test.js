import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import GridBehaviorWidget from './GridBehaviorWidget'

describe('GridBehaviorWidget', () => {
  let dispatchMock

  let initialState = {
    systemConfiguration: {
      gridBehavior: {
        gridVoltage: {
          grid: {
            voltage: 1
          }
        }
      }
    },
    site: {}
  }

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<GridBehaviorWidget />)(
      initialState
    )
    expect(component).toMatchSnapshot()
  })
})
