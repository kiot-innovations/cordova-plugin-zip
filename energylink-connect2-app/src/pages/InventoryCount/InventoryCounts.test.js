import React from 'react'
import { shallow } from 'enzyme'
import InventoryCount from '.'
import * as i18n from 'shared/i18n'
import * as reactRedux from 'react-redux'

describe('Inventory Count page', () => {
  let dispatchMock

  const initialState = [
    { item: 'MODULES', value: '0' },
    { item: 'STRING_INVERTERS', value: '0' },
    { item: 'METERS', value: '0' },
    { item: 'MET_STATION', value: '0' },
    { item: 'ESS', value: 'None' },
    { item: 'GCM', value: '0' }
  ]

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
