import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import * as wifiActions from '../../state/actions/wifi'
import WifiSettings from '.'
import * as i18n from '../../shared/i18n'

const wifiStore = {
  networks: [
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
  ],
  collectorStatus: {
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
}

describe('WifiSettings page', () => {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(wifiActions, 'getWifiNetworks').mockImplementation(jest.fn)
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => wifiStore)
  })

  it('renders without crashing', () => {
    const component = shallow(<WifiSettings />)
    expect(component).toMatchSnapshot()
  })

  it('triggers scan networks', () => {
    const component = shallow(<WifiSettings />)
    component.find('.btn-scan').simulate('click')

    expect(wifiActions.getWifiNetworks).toBeCalledWith(
      wifiStore.collectorStatus.SN,
      true
    )
  })
})
