import React from 'react'
import * as reactRedux from 'react-redux'

import ESSHealthCheckErrorList from '.'

import * as i18n from 'shared/i18n'

describe('ESSHealthCheckErrorList', () => {
  describe('initial state', () => {
    let dispatchMock
    let initialState = {
      results: {
        errors: []
      }
    }

    beforeEach(() => {
      dispatchMock = jest.fn()
      jest
        .spyOn(reactRedux, 'useDispatch')
        .mockImplementation(() => dispatchMock)
      jest
        .spyOn(i18n, 'useI18n')
        .mockImplementation(path => (key, ...params) =>
          `${key.toUpperCase()} ${params.join('_')}`.trim()
        )
    })

    test('render correctly', () => {
      const component = mountWithProvider(
        <ESSHealthCheckErrorList {...initialState} />
      )({})
      expect(component).toMatchSnapshot()
    })
  })
})
