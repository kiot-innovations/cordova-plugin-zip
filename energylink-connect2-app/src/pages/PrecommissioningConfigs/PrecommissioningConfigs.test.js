import { clone } from 'ramda'
import React from 'react'

import PrecommissioningConfigs from '.'

import * as i18n from 'shared/i18n'
import { fwupStatus } from 'state/reducers/firmware-update'
import { rmaModes } from 'state/reducers/rma'

describe('Precommissioning configurations page', () => {
  let mockState = {
    global: {
      canAccessScandit: true
    },
    rma: {
      rmaMode: rmaModes.NONE
    },
    inventory: {
      bom: [{ item: 'ESS', value: '0' }]
    },
    systemConfiguration: {
      submit: {
        preconfigState: 'NOT_STARTED',
        preconfigError: 'ERROR'
      },
      meter: {
        consumptionCT: 1,
        productionCT: 1,
        ratedCurrent: 100
      },
      gridBehavior: {
        selectedOptions: {
          gridVoltage: 240,
          profile: {
            selfsupply: false,
            zipcodes: [
              {
                max: 96162,
                min: 90001
              }
            ],
            filename: '816bf330.meta',
            id: '816bf3302d337a42680b996227ddbc46abf9cd05',
            name: 'IEEE-1547a-2014 + 2020 CA Rule21'
          },
          lazyGridProfile: 0,
          exportLimit: -1
        },
        profiles: [],
        gridVoltage: {
          grid_voltage: 240,
          measured: 0,
          selected: 0
        }
      }
    },
    devices: {
      found: [],
      progress: []
    },
    site: {
      site: {
        siteKey: ''
      }
    },
    pvs: {
      serialNumbers: []
    },
    firmwareUpdate: {
      status: fwupStatus.GRID_PROFILES_UPLOADED
    }
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(() => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const { component } = mountWithProvider(<PrecommissioningConfigs />)(
      mockState
    )
    expect(component).toMatchSnapshot()
  })

  test('banner shows up if meters are not present in store', () => {
    const baseState = clone(mockState)
    baseState.devices.progress = {
      progress: [
        {
          TYPE: 'MicroInverters',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'PVS5Meter',
          PROGR: '100',
          NFOUND: '2'
        }
      ],
      complete: true,
      result: 'succeed'
    }
    baseState.devices.found = [
      {
        DETAIL: 'detail',
        STATE: 'working',
        STATEDESCR: 'Working',
        SERIAL: 'ZT191585000549A0355',
        MODEL: 'PV Supervisor PVS6',
        HWVER: '6.02',
        SWVER: '2020.9, Build 8126',
        DEVICE_TYPE: 'PVS',
        DATATIME: '2020,09,15,16,32,23',
        dl_err_count: '0',
        dl_comm_err: '0',
        dl_skipped_scans: '0',
        dl_scan_time: '0',
        dl_untransmitted: '0',
        dl_uptime: '6235',
        dl_cpu_load: '1.14',
        dl_mem_used: '51476',
        dl_flash_avail: '107329',
        panid: 453726776,
        CURTIME: '2020,09,15,16,32,25'
      }
    ]

    const { component } = mountWithProvider(<PrecommissioningConfigs />)(
      baseState
    )

    expect(component.find('.banner')).toHaveLength(1)
  })
})
