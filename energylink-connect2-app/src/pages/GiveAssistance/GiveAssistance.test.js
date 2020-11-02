import React from 'react'
import GiveAssistance from '.'
import * as i18n from 'shared/i18n'

describe('GiveAssistance component', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      useHistory: () => ({
        history: {
          push: jest.fn()
        }
      })
    }))

    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = mountWithProvider(<GiveAssistance />)({})
    expect(component).toMatchSnapshot()
  })
})
