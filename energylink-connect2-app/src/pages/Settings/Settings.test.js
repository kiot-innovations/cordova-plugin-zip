import React from 'react'
import * as reactRedux from 'react-redux'

import * as i18n from '../../shared/i18n'

import Settings from '.'

import * as utils from 'shared/utils'

describe('Settings component', () => {
  let dispatchMock
  let isIosMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    isIosMock = jest.fn().mockReturnValue(true)
    jest.spyOn(utils, 'isIos').mockImplementation(() => isIosMock)
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(i18n, 'useI18n').mockImplementation(() => key => key)
  })
  test('render correctly when checklist off', () => {
    const { component } = mountWithProvider(<Settings />)({
      global: {
        showPrecommissioningChecklist: false
      },
      user: {
        data: {
          name: 'john doe solar'
        }
      }
    })
    expect(
      component
        .find('Toggler')
        .first()
        .prop('checked')
    ).toBe(false)
    expect(component).toMatchSnapshot()
  })
  test('render correctly when checklist on', () => {
    const { component } = mountWithProvider(<Settings />)({
      global: {
        showPrecommissioningChecklist: true
      },
      user: {
        data: {
          name: 'john doe solar'
        }
      }
    })
    expect(
      component
        .find('Toggler')
        .first()
        .prop('checked')
    ).toBe(true)
    expect(component).toMatchSnapshot()
  })
})
