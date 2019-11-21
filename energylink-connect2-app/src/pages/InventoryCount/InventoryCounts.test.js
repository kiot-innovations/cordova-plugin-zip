import React from 'react'
import { shallow } from 'enzyme'
import InventoryCount from '.'
import * as i18n from 'shared/i18n'
import * as reactRedux from 'react-redux'

describe('Inventory Count page', () => {
  let dispatchMock

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
    const component = shallow(<InventoryCount />)
    expect(component).toMatchSnapshot()
  })
})
