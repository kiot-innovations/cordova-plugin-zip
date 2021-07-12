import React from 'react'
import * as reactRedux from 'react-redux'

import CreateSite from '.'

import * as i18n from 'shared/i18n'

describe('CreateSite component', () => {
  describe('initial state', () => {
    let dispatchMock
    let initialState = {
      site: {
        isFetching: false,
        isSaving: false,
        sites: [],
        site: null,
        error: null,
        saveError: null,
        mapViewSrc: false
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
      const component = mountWithProvider(<CreateSite />)(initialState)
      expect(component).toMatchSnapshot()
    })
  })

  describe('with error', () => {
    let dispatchMock
    let initialState = {
      site: {
        isFetching: false,
        isSaving: false,
        sites: [],
        site: null,
        error: true,
        saveError: null,
        mapViewSrc: false
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
      const component = mountWithProvider(<CreateSite />)(initialState)
      expect(component).toMatchSnapshot()
    })
  })
})
