import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import EQSUpdate from '.'

describe('EQS Connected Device Update', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly', () => {
    const { component } = mountWithProvider(<EQSUpdate />)({
      storage: {
        error: 'EQS_UPDATE_ERROR',
        firmware_update_status: 'RUNNING',
        status_report: [
          {
            progress: 0.8008281904610115,
            serial_number: 'serial_number',
            device_type: 'MIDC',
            fw_ver_from: '1.2.3'
          }
        ]
      }
    })

    expect(component).toMatchSnapshot()
  })
})
