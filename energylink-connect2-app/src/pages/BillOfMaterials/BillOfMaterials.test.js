import React from 'react'
import BillOfMaterials from '.'
import * as i18n from '../../shared/i18n'

describe('BillOfMaterials component', () => {
  beforeEach(() => {
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
