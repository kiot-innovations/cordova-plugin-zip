import React from 'react'
import * as reactRedux from 'react-redux'

import * as i18n from '../../shared/i18n'

import {
  systemChecksDefaultState,
  systemChecksDefaultStateFAILED,
  systemChecksDefaultStateRUNNING,
  systemChecksDefaultStateSUCCEEDED
} from './SystemChecksACPV.stories'

import SystemChecksACPV from '.'

describe('SystemChecksACPV component', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, data) => (data ? `${data} ${key}` : key))
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<SystemChecksACPV />)(
      systemChecksDefaultState
    )
    expect(component).toMatchSnapshot()
  })

  test('render correctly when RUNNING', () => {
    const { component } = mountWithProvider(<SystemChecksACPV />)(
      systemChecksDefaultStateRUNNING
    )
    expect(component).toMatchSnapshot()
  })

  test('render correctly when FAILED', () => {
    const { component } = mountWithProvider(<SystemChecksACPV />)(
      systemChecksDefaultStateFAILED
    )
    expect(component.find('section button').length).toBe(3)
    expect(component).toMatchSnapshot()
  })

  test('render correctly when SUCCEEDED', () => {
    const { component } = mountWithProvider(<SystemChecksACPV />)(
      systemChecksDefaultStateSUCCEEDED
    )
    expect(component.find('section button').length).toBe(2)
    expect(component).toMatchSnapshot()
  })
})
