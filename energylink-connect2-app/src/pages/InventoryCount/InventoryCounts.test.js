import React from 'react'
import { shallow } from 'enzyme'
import InventoryCount from '.'
import * as i18n from 'shared/i18n'
import * as reactRedux from 'react-redux'

describe('Inventory Count page', () => {
  let dispatchMock

  const initialState = {
    bom: {
      MODULES: 0,
      STRING_INVERTERS: 0,
      METERS: 0,
      ESS: 0,
      STORAGE_INVERTERS: 0,
      TRANSFER_SWITCHES: 0,
      BATTERIES: 0,
      GCM: 0,
      MET_STATION: 0
    },
    fetchingInventory: false,
    savingInventory: false
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
    const component = shallow(<InventoryCount />)
    expect(component).toMatchSnapshot()
  })
})
