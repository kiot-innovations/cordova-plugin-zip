import React from 'react'
import * as i18n from 'shared/i18n'
import * as SelectField from 'components/SelectField'
import RMAInventory from '.'

describe('RMAInventory', () => {
  let state = {
    inventory: {
      bom: [
        { item: 'AC_MODULES', value: '0' },
        { item: 'DC_MODULES', value: '0' },
        { item: 'STRING_INVERTERS', value: '0' },
        { item: 'EXTERNAL_METERS', value: '0' },
        { item: 'ESS', value: '0' }
      ],
      rma: {
        other: true
      }
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )

    jest.spyOn(SelectField, 'default').mockImplementation(() => <div />)
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<RMAInventory />)(state)
    expect(component).toMatchSnapshot()
  })
})
