import { shallow } from 'enzyme'
import React from 'react'
import * as reactRedux from 'react-redux'

import StringInverter from '.'

import * as i18n from 'shared/i18n'

describe('StringInverter Component', () => {
  const updateDevice = jest.fn()

  const device = {
    MODEL: 'SMA-SB3.8-1SP-US-40',
    SERIAL: '0142142142'
  }

  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => dispatchMock)
  })

  test('Renders Correctly', () => {
    const component = shallow(
      <StringInverter device={device} updateDevice={updateDevice} />
    )
    expect(component).toMatchSnapshot()
  })
})
