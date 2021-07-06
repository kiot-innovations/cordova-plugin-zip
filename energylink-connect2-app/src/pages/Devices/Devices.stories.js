import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'

import { configureStore } from 'state/store'

import Devices from '.'

const discoveryInProgress = {
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      }
    ]
  },
  devices: {
    candidates: [
      { SERIAL: 'E00110223232323', STATEDESCR: 'NEW' },
      { SERIAL: 'E00110223232324', STATEDESCR: 'OK' }
    ],
    claimingDevices: false,
    claimError: null,
    claimProgress: 0,
    error: null,
    progress: {
      progress: [
        {
          TYPE: 'MicroInverters',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'SPRf',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'SunSpecDevices',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'Meters',
          PROGR: '20',
          NFOUND: '0'
        },
        {
          TYPE: 'HubPlus',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'OtherInverters',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'MetStations',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'MIO',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'PV Disconnect',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'SPRm',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'SPRk',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'SPRp',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'GroundCurMon',
          PROGR: '100',
          NFOUND: '0'
        },
        {
          TYPE: 'PVS5Meter',
          PROGR: '100',
          NFOUND: '2'
        }
      ],
      complete: false,
      result: 'succeed'
    },
    discoverComplete: false
  }
}

const discoveryComplete = {
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      }
    ]
  },
  devices: {
    candidates: [
      { SERIAL: 'E00110223232323', STATEDESCR: 'OK' },
      { SERIAL: 'E00110223232324', STATEDESCR: 'OK' }
    ],
    claimingDevices: false,
    claimError: null,
    claimProgress: 0,
    error: null,
    progress: {
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
      complete: false,
      result: 'succeed'
    }
  }
}

const discoveryFailed = {
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00110223232323'
      },
      {
        serial_number: 'E00110223232324'
      }
    ]
  },
  devices: {
    candidates: [
      { SERIAL: 'E00110223232323', STATEDESCR: 'PLC_STATS_ERROR' },
      { SERIAL: 'E00110223232324', STATEDESCR: 'PLC_STATS_ERROR' }
    ],
    claimingDevices: false,
    claimError: null,
    claimProgress: 0,
    error: null,
    progress: 100,
    discoveryComplete: true
  }
}

const discoveryCompleteWithoutMeters = {
  pvs: {
    serialNumbers: [
      {
        serial_number: 'E00110223232323',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      },
      {
        serial_number: 'E00110223232324',
        indicator: 'MI_OK',
        STATEDESCR: 'OK'
      }
    ]
  },
  devices: {
    candidates: [
      { SERIAL: 'E00110223232323', STATEDESCR: 'OK' },
      { SERIAL: 'E00110223232324', STATEDESCR: 'OK' }
    ],
    claimingDevices: false,
    claimError: null,
    claimProgress: 0,
    error: null,
    progress: {
      progress: [
        {
          TYPE: 'MicroInverters',
          PROGR: '100',
          NFOUND: '0'
        }
      ],
      complete: true,
      result: 'succeed'
    }
  }
}

storiesOf('MI Discovery', module)
  .add('In Progress', () => {
    const { store } = configureStore(discoveryInProgress)

    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
  .add('Complete - all found', () => {
    const { store } = configureStore(discoveryComplete)

    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
  .add('Complete - no devices found', () => {
    const { store } = configureStore(discoveryFailed)

    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
  .add('Complete - no meters found', () => {
    const { store } = configureStore(discoveryCompleteWithoutMeters)

    return (
      <div className="full-min-height pt-20 pb-20">
        <Provider store={store}>
          <Devices />
        </Provider>
      </div>
    )
  })
