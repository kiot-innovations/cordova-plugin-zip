import React from 'react'
import * as i18n from 'shared/i18n'
import * as SelectField from 'components/SelectField'
import RMAInventory from '.'

describe('RMAInventory', () => {
  let state = {
    inventory: {
      rma: {
        mi_count: 0,
        ess: '',
        other: false
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
