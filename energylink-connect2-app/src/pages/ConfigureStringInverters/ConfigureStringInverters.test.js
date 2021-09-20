import { clone } from 'ramda'
import React from 'react'

import ConfigureStringInverters from '.'

import SwipeableSheet from 'hocs/SwipeableSheet'
import * as i18n from 'shared/i18n'

const mock = jest.fn()
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mock
  })
}))

describe('ConfigureStringInverters component', () => {
  const store = {
    pvs: {
      settingMetadata: {},
      setMetadataStatus: ''
    },
    devices: {
      found: [
        {
          SERIAL: 'ConsumptionMeter001ca',
          DEVICE_TYPE: 'Inverter',
          SUBTYPE: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A390-BLK',
          COUNT: 1
        },
        {
          SERIAL: 'ConsumptionMeter002ca',
          DEVICE_TYPE: 'Inverter',
          SUBTYPE: 'NOT_USED',
          MODEL: 'inverter',
          panelModel: 'SPR-A400-BLK',
          COUNT: 1
        }
      ]
    },
    stringInverters: {
      models: ['SPR-A390-BLK', 'SPR-A400-BLK']
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const { component } = mountWithProvider(<ConfigureStringInverters />)(store)
    expect(component).toMatchSnapshot()
  })

  test('runs SwipeableSheet onChange', () => {
    const pushMock = jest.fn(path => path)
    window.history.push = pushMock

    let ssStore = clone(store)
    ssStore.pvs = {
      settingMetadata: false,
      setMetadataStatus: 'success'
    }

    const { component } = mountWithProvider(<ConfigureStringInverters />)(
      ssStore
    )

    const sheet = component.find(SwipeableSheet).at(0)
    sheet.prop('onChange')()

    expect(mock).toBeCalled()
  })

  test('runs SwipeableSheet close', () => {
    const pushMock = jest.fn(path => path)
    window.history.push = pushMock

    let ssStore = clone(store)
    ssStore.pvs = {}

    const { component } = mountWithProvider(<ConfigureStringInverters />)(
      ssStore
    )

    const sheet = component.find(SwipeableSheet).last()
    const closeButton = sheet.find('button.is-primary')

    closeButton.simulate('click')
    expect(sheet.prop('open')).toBe(false)
  })

  test('runs goBack', () => {
    const pushMock = jest.fn(path => path)
    window.history.push = pushMock

    const { component } = mountWithProvider(<ConfigureStringInverters />)(store)

    const goBackButton = component.find(
      '.sp-chevron-left.has-text-primary.is-size-4.go-back'
    )
    goBackButton.simulate('click')
    expect(mock).toBeCalled()
  })

  test('runs saveInverters and opens PendingCOnfig SwipeableSheet', () => {
    const { component } = mountWithProvider(<ConfigureStringInverters />)(store)

    const saveButton = component.find('button.is-primary.is-fullwidth.ml-10')
    saveButton.simulate('click')
    expect(mock).toBeCalled()

    const sheet = component.find(SwipeableSheet).last()
    expect(sheet.prop('open')).toBe(true)
  })
})
