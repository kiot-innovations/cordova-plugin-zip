import { clone } from 'ramda'
import React from 'react'
import { act } from 'react-dom/test-utils'
import * as reactRedux from 'react-redux'

import RmaDevices from './index'

import * as i18n from 'shared/i18n'
import { rmaModes } from 'state/reducers/rma'

const basicState = {
  pvs: {
    model: 'PVS6'
  },
  rma: {
    removingStorage: false,
    removingStorageError: false
  },
  devices: {
    found: [
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
      },
      {
        ISDETAIL: true,
        SERIAL: 'PVS6M19150355p',
        TYPE: 'PVS5-METER-P',
        STATE: 'working',
        STATEDESCR: 'Working',
        MODEL: 'PVS6M0400p',
        DESCR: 'Power Meter PVS6M19150355p',
        DEVICE_TYPE: 'Power Meter',
        SWVER: '3000',
        PORT: '',
        DATATIME: '2020,09,15,16,32,25',
        ct_scl_fctr: '50',
        net_ltea_3phsum_kwh: '301.5777',
        p_3phsum_kw: '0',
        q_3phsum_kvar: '0',
        s_3phsum_kva: '0',
        tot_pf_rto: '1',
        freq_hz: '0',
        CAL0: '50',
        origin: 'data_logger',
        OPERATION: 'noop',
        CURTIME: '2020,09,15,16,32,26'
      },
      {
        ISDETAIL: true,
        SERIAL: 'PVS6M19150355c',
        TYPE: 'PVS5-METER-C',
        STATE: 'working',
        STATEDESCR: 'Working',
        MODEL: 'PVS6M0400c',
        DESCR: 'Power Meter PVS6M19150355c',
        DEVICE_TYPE: 'Power Meter',
        SWVER: '3000',
        PORT: '',
        DATATIME: '2020,09,15,16,32,25',
        ct_scl_fctr: '100',
        net_ltea_3phsum_kwh: '-25.2471',
        p_3phsum_kw: '0',
        q_3phsum_kvar: '0',
        s_3phsum_kva: '0',
        tot_pf_rto: '0',
        freq_hz: '0',
        i1_a: '0',
        i2_a: '0',
        v1n_v: '0',
        v2n_v: '0',
        v12_v: '0',
        p1_kw: '0',
        p2_kw: '0',
        neg_ltea_3phsum_kwh: '165.6923',
        pos_ltea_3phsum_kwh: '140.4451',
        CAL0: '100',
        origin: 'data_logger',
        OPERATION: 'noop',
        CURTIME: '2020,09,15,16,32,26'
      },
      {
        ISDETAIL: true,
        SERIAL: 'E00121939001311',
        TYPE: 'SOLARBRIDGE',
        STATE: 'working',
        STATEDESCR: 'Working',
        MODEL: 'AC_Module_Type_E',
        DESCR: 'Inverter E00121939001311',
        DEVICE_TYPE: 'Inverter',
        PANEL: 'SPR-E19-320-E-AC',
        SWVER: '4.14.5',
        PORT: '',
        MOD_SN: '',
        NMPLT_SKU: '',
        DATATIME: '2020,09,15,16,32,23',
        ltea_3phsum_kwh: '0',
        p_3phsum_kw: '0',
        vln_3phavg_v: '0',
        i_3phsum_a: '0',
        p_mppt1_kw: '0.001',
        v_mppt1_v: '48.25',
        i_mppt1_a: '0.02',
        t_htsnk_degc: '27',
        freq_hz: '0',
        stat_ind: '0',
        origin: 'data_logger',
        OPERATION: 'noop',
        CURTIME: '2020,09,15,16,32,26'
      },
      {
        ISDETAIL: true,
        SERIAL: 'E00121939002888',
        TYPE: 'SOLARBRIDGE',
        STATE: 'working',
        STATEDESCR: 'Working',
        MODEL: 'AC_Module_Type_E',
        DESCR: 'Inverter E00121939002888',
        DEVICE_TYPE: 'Inverter',
        PANEL: 'SPR-E19-320-E-AC',
        SWVER: '4.14.5',
        PORT: '',
        MOD_SN: '',
        NMPLT_SKU: '',
        DATATIME: '2020,09,15,16,32,23',
        ltea_3phsum_kwh: '0',
        p_3phsum_kw: '0',
        vln_3phavg_v: '0',
        i_3phsum_a: '0',
        p_mppt1_kw: '0.0016',
        v_mppt1_v: '48.2',
        i_mppt1_a: '0.03',
        t_htsnk_degc: '31',
        freq_hz: '0',
        stat_ind: '0',
        origin: 'data_logger',
        OPERATION: 'noop',
        CURTIME: '2020,09,15,16,32,26'
      }
    ]
  },
  storage: {
    prediscovery: {
      pre_discovery_report: {
        devices: [
          {
            device_fw_ver: '10600.386',
            device_type: 'STORAGE_INVERTER',
            serial_number: '00001B3DDACD'
          },
          {
            device_fw_ver: '0',
            device_type: 'BATTERY',
            serial_number: 'F2191700087033685504'
          },
          {
            device_fw_ver: 'v1.08.415',
            device_type: 'GATEWAY',
            serial_number: 'F21917000870'
          },
          {
            device_fw_ver: '0.6.13',
            device_type: 'MIDC',
            serial_number: 'Serial-MIDC-Saturn'
          },
          {
            device_fw_ver: '0.6.3',
            device_type: 'MIO',
            serial_number: 'Serial-MIO-Saturn'
          },
          {
            device_fw_ver: '0',
            device_type: 'PV-DISCONNECT',
            serial_number: 'SW2342342342342.23424_PVD1',
            model: 'SunPower PV Disonnect Relay'
          }
        ]
      }
    }
  }
}

describe('RMA devices component', () => {
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

  test('render correctly', () => {
    const initialState = clone(basicState)
    const { component } = mountWithProvider(<RmaDevices />)(initialState)
    expect(component).toMatchSnapshot()
  })

  test('UI shows up when clicking on recommission storage', () => {
    const initialState = clone(basicState)
    const { component } = mountWithProvider(<RmaDevices />)(initialState)
    component
      .find('#storageCommissioningOrRecommissioningHandler')
      .simulate('click')
    expect(
      component.find('#sunVaultRecommissionConfirmationModal').length
    ).toBe(1)
  })

  test('UI shows a pending state while removing storage components', async () => {
    const initialState = clone(basicState)
    initialState.rma.removingStorage = true
    const { component } = mountWithProvider(<RmaDevices />)(initialState)
    await act(() => new Promise(setImmediate))
    component.update()
    expect(component.find('#storageRemovingModal').length).toBe(1)
  })

  test('UI shows an state when the removal of storage components fails', async () => {
    const initialState = clone(basicState)
    initialState.rma.removingStorageError = 'Yes, an error. Hi!'
    const { component } = mountWithProvider(<RmaDevices />)(initialState)
    await act(() => new Promise(setImmediate))
    component.update()
    expect(component.find('.storage-removing-error-modal').length).toBe(1)
  })

  test('render correctly', () => {
    const initialState = {
      pvs: {
        model: 'PVS6'
      },
      rma: {
        rmaMode: rmaModes.EDIT_DEVICES
      },
      devices: {
        found: [
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
          },
          {
            ISDETAIL: true,
            SERIAL: 'PVS6M19150355p',
            TYPE: 'PVS5-METER-P',
            STATE: 'working',
            STATEDESCR: 'Working',
            MODEL: 'PVS6M0400p',
            DESCR: 'Power Meter PVS6M19150355p',
            DEVICE_TYPE: 'Power Meter',
            SWVER: '3000',
            PORT: '',
            DATATIME: '2020,09,15,16,32,25',
            ct_scl_fctr: '50',
            net_ltea_3phsum_kwh: '301.5777',
            p_3phsum_kw: '0',
            q_3phsum_kvar: '0',
            s_3phsum_kva: '0',
            tot_pf_rto: '1',
            freq_hz: '0',
            CAL0: '50',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,09,15,16,32,26'
          },
          {
            ISDETAIL: true,
            SERIAL: 'PVS6M19150355c',
            TYPE: 'PVS5-METER-C',
            STATE: 'working',
            STATEDESCR: 'Working',
            MODEL: 'PVS6M0400c',
            DESCR: 'Power Meter PVS6M19150355c',
            DEVICE_TYPE: 'Power Meter',
            SWVER: '3000',
            PORT: '',
            DATATIME: '2020,09,15,16,32,25',
            ct_scl_fctr: '100',
            net_ltea_3phsum_kwh: '-25.2471',
            p_3phsum_kw: '0',
            q_3phsum_kvar: '0',
            s_3phsum_kva: '0',
            tot_pf_rto: '0',
            freq_hz: '0',
            i1_a: '0',
            i2_a: '0',
            v1n_v: '0',
            v2n_v: '0',
            v12_v: '0',
            p1_kw: '0',
            p2_kw: '0',
            neg_ltea_3phsum_kwh: '165.6923',
            pos_ltea_3phsum_kwh: '140.4451',
            CAL0: '100',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,09,15,16,32,26'
          },
          {
            ISDETAIL: true,
            SERIAL: 'E00121939001311',
            TYPE: 'SOLARBRIDGE',
            STATE: 'working',
            STATEDESCR: 'Working',
            MODEL: 'AC_Module_Type_E',
            DESCR: 'Inverter E00121939001311',
            DEVICE_TYPE: 'Inverter',
            PANEL: 'SPR-E19-320-E-AC',
            SWVER: '4.14.5',
            PORT: '',
            MOD_SN: '',
            NMPLT_SKU: '',
            DATATIME: '2020,09,15,16,32,23',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.001',
            v_mppt1_v: '48.25',
            i_mppt1_a: '0.02',
            t_htsnk_degc: '27',
            freq_hz: '0',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,09,15,16,32,26'
          },
          {
            ISDETAIL: true,
            SERIAL: 'E00121939002888',
            TYPE: 'SOLARBRIDGE',
            STATE: 'working',
            STATEDESCR: 'Working',
            MODEL: 'AC_Module_Type_E',
            DESCR: 'Inverter E00121939002888',
            DEVICE_TYPE: 'Inverter',
            PANEL: 'SPR-E19-320-E-AC',
            SWVER: '4.14.5',
            PORT: '',
            MOD_SN: '',
            NMPLT_SKU: '',
            DATATIME: '2020,09,15,16,32,23',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0016',
            v_mppt1_v: '48.2',
            i_mppt1_a: '0.03',
            t_htsnk_degc: '31',
            freq_hz: '0',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,09,15,16,32,26'
          }
        ],
        fetchingDevices: false
      },
      storage: {
        prediscovery: {
          pre_discovery_report: {
            devices: [
              {
                device_fw_ver: '10600.386',
                device_type: 'STORAGE_INVERTER',
                serial_number: '00001B3DDACD'
              },
              {
                device_fw_ver: '0',
                device_type: 'BATTERY',
                serial_number: 'F2191700087033685504'
              },
              {
                device_fw_ver: 'v1.08.415',
                device_type: 'GATEWAY',
                serial_number: 'F21917000870'
              },
              {
                device_fw_ver: '0.6.13',
                device_type: 'MIDC',
                serial_number: 'Serial-MIDC-Saturn'
              },
              {
                device_fw_ver: '0.6.3',
                device_type: 'MIO',
                serial_number: 'Serial-MIO-Saturn'
              },
              {
                device_fw_ver: '0',
                device_type: 'PV-DISCONNECT',
                serial_number: 'SW2342342342342.23424_PVD1',
                model: 'SunPower PV Disonnect Relay'
              }
            ]
          }
        }
      }
    }
    const { component } = mountWithProvider(<RmaDevices />)(initialState)
    expect(component).toMatchSnapshot()
  })
})
