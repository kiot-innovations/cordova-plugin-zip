import React from 'react'
import GetAssistance from '.'
import * as i18n from 'shared/i18n'

describe('GetAssistance component', () => {
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
    const component = mountWithProvider(<GetAssistance />)({})
    expect(component).toMatchSnapshot()
  })
})
