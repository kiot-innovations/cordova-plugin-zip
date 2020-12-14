import React from 'react'
import InventoryCount from '.'
import * as i18n from 'shared/i18n'
import * as reactRedux from 'react-redux'

describe('Inventory Count page', () => {
  let dispatchMock

  const initialState = {
    network: {
      connected: false
    },
    inventory: {
      bom: [
        { item: 'AC_MODULES', value: '0' },
        { item: 'DC_MODULES', value: '0' },
        { item: 'STRING_INVERTERS', value: '0' },
        { item: 'EXTERNAL_METERS', value: '0' },
        { item: 'ESS', value: '0' }
      ],
      fetchingInventory: false,
      savingInventory: false
    }
  }

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          push: jest.fn()
        }
      })
    }))
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<InventoryCount />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
