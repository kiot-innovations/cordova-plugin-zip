import InstallSuccessful from 'pages/InstallSuccess'
import React from 'react'
import * as i18n from 'shared/i18n'

describe('PVS connection successful component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<InstallSuccessful />)({})
    expect(component).toMatchSnapshot()
  })
})
