import * as wifiActions from '../../actions/wifi'
import { wifiReducer } from '.'

const wifiCollector = {
  AddressID: 84471,
  ComponentTypeID: 3,
  ComponentID: 104359,
  ComponentSerialNumber: 'ZT153185000441C0006',
  AltSerialNumber: null,
  RealComponentSerialNumber: 'ZT153185000441C0006',
  ParentComponentTypeID: 4,
  ParentComponentID: null,
  ParentComponentSerialNumber: null,
  RealParentComponentSerialNumber: null,
  DecommissionedFlag: 0,
  DecommissionedDate: null,
  ExtendedMappingID: 12010,
  InceptionDate: '2015-10-01T16:20:12.890Z',
  ComponentStatus: 'Working',
  HardwareVersion: '0',
  SoftwareVersion: '2018.0 build 2051',
  Model: 'PV Supervisor PVS5',
  ExtendedParameterVersion: null,
  ModelFamily: 'SMS2.0',
  ModelFamilyName: 'SMS2.0',
  FirmwareVersion: '0.0.18.51',
  systemRatedPower: null,
  ACPVFlag: null,
  IsUsingCellularNetwork: false
}

const wifiStatus = {
  NetIntfRptCtnt: {
    sta0Ssid: 'SunPower04602',
    sgnlStrenSta0Dbm: -67,
    cellMdmStatVal: 'MODEM_OK',
    currNetIntfEnum: 'STA0',
    edpConnFl: true,
    cellStatEnum: 'REGISTERED_HOME',
    cellSimStatVal: 'SIM_READY',
    inetConnFl: true,
    cellSgnlStrenDbm: -99,
    prevNetIntfEnum: 'STA0',
    cellPrvdNm: 'AT&T',
    msgCrtEps: 1564109546,
    wifiStatEnum: 'CONNECTED'
  },
  EvtMsgNm: 'InitialSetUp',
  ProdMdlNm: 'PV Supervisor PVS5',
  ProdFamNm: 'SMS5.0',
  HwVerVal: '0',
  FwVerVal: '0.0.18.51',
  WifiScanRptCtnt: {
    msgCrtEps: 1506532032,
    wifiAps: [
      {
        secCapblStr: '[WPA2-PSK-CCMP][WPS][ESS]',
        rssiDbm: -74,
        chnVal: 1,
        ssid: 'ATT65PQc2w',
        bssid: '14:ed:bb:87:15:86'
      },
      {
        secCapblStr: '[WPA-PSK-CCMP+TKIP][WPA2-PSK-CCMP+TKIP][ESS]',
        rssiDbm: -81,
        chnVal: 11,
        ssid: 'BabyGorilla',
        bssid: '14:35:8b:0f:5b:ac'
      },
      {
        secCapblStr: '[WPA-PSK-CCMP+TKIP][WPA2-PSK-CCMP+TKIP][WPS][ESS]',
        rssiDbm: -87,
        chnVal: 1,
        ssid: 'BrownShark',
        bssid: 'c8:d7:19:b0:3c:55'
      }
    ]
  },
  DvcKey: 'ZT153185000441C0006_PV Supervisor PVS5',
  WifiStatRptCtnt: {
    rssiDbm: -84,
    msgCrtEps: 1502732619,
    wifiStatEnum: 'CONNECTED',
    inetConnFl: true,
    ssid: 'BabyGorilla',
    ip: '192.168.8.100'
  },
  InitConnEps: 1493407175,
  MsgCrtEps: 1565539000,
  SN: 'ZT153185000441C0006',
  SfwVerVal: '2018.0 build 2051',
  DvcTy: 'logger'
}

const wifiNetworks = [
  {
    secCapblStr: '[WPA2-PSK-CCMP][WPS][ESS]',
    rssiDbm: -74,
    chnVal: 1,
    ssid: 'ATT65PQc2w',
    bssid: '14:ed:bb:87:15:86'
  },
  {
    secCapblStr: '[WPA-PSK-CCMP+TKIP][WPA2-PSK-CCMP+TKIP][ESS]',
    rssiDbm: -81,
    chnVal: 11,
    ssid: 'BabyGorilla',
    bssid: '14:35:8b:0f:5b:ac'
  },
  {
    secCapblStr: '[WPA-PSK-CCMP+TKIP][WPA2-PSK-CCMP+TKIP][WPS][ESS]',
    rssiDbm: -87,
    chnVal: 1,
    ssid: 'BrownShark',
    bssid: 'c8:d7:19:b0:3c:55'
  }
]

const calculatedWifiStrength = {
  ATT65PQc2w: 3,
  BabyGorilla: 2,
  BrownShark: 1
}

describe('Wifi reducer', () => {
  const reducerTest = reducerTester(wifiReducer)

  it('returns the initial state', () => {
    reducerTest({}, {}, {})
  })

  it('empties collector object & flag isGettingCollector when WIFI_COLLECTOR_INIT action is fired', () => {
    reducerTest({}, wifiActions.WIFI_COLLECTOR_INIT(), {
      isGettingCollector: true,
      collector: {}
    })
  })

  it('sets collector data & off flag isGettingCollector when WIFI_COLLECTOR_SUCCESS action is fired', () => {
    reducerTest({}, wifiActions.WIFI_COLLECTOR_SUCCESS(wifiCollector), {
      isGettingCollector: false,
      hasWifiInitialData: true,
      collector: wifiCollector
    })
  })

  it('empties collector object & off flag isGettingCollector when WIFI_COLLECTOR_ERROR action is fired', () => {
    reducerTest({}, wifiActions.WIFI_COLLECTOR_ERROR(), {
      isGettingCollector: false,
      collector: {}
    })
  })

  it('flag isGettingCommand when WIFI_COMMAND_STATUS_INIT action is fired', () => {
    reducerTest({}, wifiActions.WIFI_COMMAND_STATUS_INIT(), {
      isGettingCommand: true
    })
  })

  it('off flag isGettingCommand when WIFI_COMMAND_STATUS_SUCCESS action is fired', () => {
    reducerTest({}, wifiActions.WIFI_COMMAND_STATUS_SUCCESS(), {
      isGettingCommand: false
    })
  })

  it('off flag isGettingCommand when WIFI_COMMAND_STATUS_ERROR action is fired', () => {
    reducerTest({}, wifiActions.WIFI_COMMAND_STATUS_ERROR(), {
      isGettingCommand: false
    })
  })

  it('empties collector Status object & flag isGettingCollectorStatus when WIFI_STATUS_INIT action is fired', () => {
    reducerTest({}, wifiActions.WIFI_STATUS_INIT(), {
      isGettingCollectorStatus: true,
      collectorStatus: {}
    })
  })

  it('sets collector Status object & off flag isGettingCollectorStatus when WIFI_STATUS_SUCCESS action is fired', () => {
    reducerTest({}, wifiActions.WIFI_STATUS_SUCCESS(wifiStatus), {
      isGettingCollectorStatus: false,
      collectorStatus: wifiStatus
    })
  })

  it('empties collector Status object & off flag isGettingCollectorStatus when WIFI_STATUS_ERROR action is fired', () => {
    reducerTest({}, wifiActions.WIFI_STATUS_ERROR(), {
      isGettingCollectorStatus: false,
      collectorStatus: {}
    })
  })

  it('empties networks array & flag isGettingNetworks when WIFI_NETWORKS_INIT action is fired', () => {
    reducerTest({}, wifiActions.WIFI_NETWORKS_INIT(), {
      isGettingNetworks: true,
      hasScanError: false,
      networks: []
    })
  })

  it('sets networks array & off flag isGettingNetworks when WIFI_NETWORKS_SUCCESS action is fired', () => {
    reducerTest({}, wifiActions.WIFI_NETWORKS_SUCCESS(wifiNetworks), {
      isGettingNetworks: false,
      hasScanError: false,
      networks: wifiNetworks.map(wn => ({
        ...wn,
        signalQuality: calculatedWifiStrength[wn.ssid]
      }))
    })
  })

  it('empties networks array & off flag isGettingNetworks when WIFI_NETWORKS_ERROR action is fired', () => {
    reducerTest({}, wifiActions.WIFI_NETWORKS_ERROR(), {
      isGettingNetworks: false,
      hasScanError: true,
      networks: []
    })
  })

  it('flag isSettingNetwork when WIFI_SET_INIT action is fired', () => {
    reducerTest({}, wifiActions.WIFI_SET_INIT(), {
      isSettingNetwork: true
    })
  })

  it('off flag isSettingNetwork when WIFI_SET_SUCCESS action is fired', () => {
    reducerTest({}, wifiActions.WIFI_SET_SUCCESS(wifiNetworks), {
      isSettingNetwork: false
    })
  })

  it('off flag isSettingNetwork when WIFI_SET_ERROR action is fired', () => {
    reducerTest({}, wifiActions.WIFI_SET_ERROR(), {
      isSettingNetwork: false
    })
  })
})
