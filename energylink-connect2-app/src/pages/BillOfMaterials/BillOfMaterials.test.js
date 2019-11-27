import React from 'react'
import BillOfMaterials from '.'
import * as i18n from '../../shared/i18n'
import * as reactRedux from 'react-redux'

describe('BillOfMaterials component', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(() => ({ MODULES: 0 }))
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })
  test('render correctly', () => {
    const { component } = mountWithProvider(<BillOfMaterials />)({
      user: {
        data: {
          AddressName: 'My house',
          phoneNumber: '555-555-5555',
          firstName: 'Cindy',
          lastName: 'Solar'
        }
      }
    })
    expect(component).toMatchSnapshot()
  })
})