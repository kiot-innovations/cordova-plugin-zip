import React from 'react'
import { shallow } from 'enzyme'
import InventoryCount from '.'
import * as i18n from 'shared/i18n'

describe('Inventory Count page', () => {
  beforeEach(() => {
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
