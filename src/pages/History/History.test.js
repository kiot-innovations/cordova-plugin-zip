import React from 'react'
import History from '.'
import * as i18n from '../../shared/i18n'

describe('History page', () => {
  beforeEach(() => {
    const baseTime = new Date(1566965470759) // Aug 27 2019 23:11:10 GMT-0500
    jest.spyOn(Date, 'now').mockImplementation(() => baseTime)

    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = mountWithProvider(<History />)
    expect(component).toMatchSnapshot()
  })
})
