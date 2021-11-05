import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import GridBehaviorWidget from './GridBehaviorWidget'
import SC from './InterfacesWidget'
import PanelLayoutWidget from './panelLayoutWidget'
import RSEWidget from './RSEWidget'

import SystemConfiguration from '.'

import { configureStore } from 'state/store'

storiesOf('System Configuration Page', module).add('InterfacesWidget', () => (
  <div className="full-min-height ml-10 mr-10 mt-20">
    <SC />
  </div>
))

storiesOf('System Configuration Page', module)
  .add('GridBehaviorWidget PVS5', () => {
    const state = {
      pvs: {
        model: 'PVS5'
      }
    }

    const { store } = configureStore(state)

    return (
      <div id="modal-root" className="full-min-height pt-20">
        <Provider store={store}>
          <GridBehaviorWidget />
        </Provider>
      </div>
    )
  })
  .add('GridBehaviorWidget PVS6', () => {
    const state = {
      pvs: {
        model: 'PVS6'
      }
    }

    const { store } = configureStore(state)

    return (
      <div id="modal-root" className="full-min-height pt-20">
        <Provider store={store}>
          <GridBehaviorWidget />
        </Provider>
      </div>
    )
  })

storiesOf('System Configuration Page', module)
  .add('panelLayoutWidget no data', () => {
    const state = {
      pvs: {
        model: 'PVS5'
      },
      pltWizard: {
        loading: false,
        panels: []
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
            SWVER: '2020.11, Build 8616',
            DEVICE_TYPE: 'PVS',
            DATATIME: '2020,11,10,22,54,49',
            dl_err_count: '0',
            dl_comm_err: '0',
            dl_skipped_scans: '0',
            dl_scan_time: '0',
            dl_untransmitted: '1261',
            dl_uptime: '1054',
            dl_cpu_load: '1.67',
            dl_mem_used: '69384',
            dl_flash_avail: '108702',
            panid: 453726776,
            CURTIME: '2020,11,10,22,54,49'
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
            DATATIME: '2020,11,10,22,54,49',
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
            CURTIME: '2020,11,10,22,54,50'
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
            DATATIME: '2020,11,10,22,54,50',
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
            CURTIME: '2020,11,10,22,54,50'
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0019',
            v_mppt1_v: '48.15',
            i_mppt1_a: '0.04',
            t_htsnk_degc: '29',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0008',
            v_mppt1_v: '48.18',
            i_mppt1_a: '0.01',
            t_htsnk_degc: '26',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
          }
        ]
      }
    }

    const { store } = configureStore(state)

    return (
      <div id="modal-root" className="full-min-height pt-20 pl-10 pr-10">
        <Provider store={store}>
          <PanelLayoutWidget />
        </Provider>
      </div>
    )
  })
  .add('panelLayoutWidget with PLT', () => {
    const state = {
      pltWizard: {
        loading: false,
        lastModifiedDate: '2020-11-10T23:05:59.908Z',
        panels: [
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939001311',
            orientation: 'lying',
            slope: null,
            x: -19.375,
            y: 20.625
          },
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939002888',
            orientation: 'lying',
            slope: null,
            x: -18.75,
            y: 21.25
          }
        ]
      },
      devices: {
        found: [
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0019',
            v_mppt1_v: '48.15',
            i_mppt1_a: '0.04',
            t_htsnk_degc: '29',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0008',
            v_mppt1_v: '48.18',
            i_mppt1_a: '0.01',
            t_htsnk_degc: '26',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
          },
          {
            ISDETAIL: true,
            SERIAL: 'E00121939001314',
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0008',
            v_mppt1_v: '48.18',
            i_mppt1_a: '0.01',
            t_htsnk_degc: '26',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
          }
        ]
      }
    }

    const { store } = configureStore(state)

    return (
      <div id="modal-root" className="full-min-height pt-20 pl-10 pr-10">
        <Provider store={store}>
          <PanelLayoutWidget />
        </Provider>
      </div>
    )
  })
  .add('panelLayoutWidget with PLT NO DATE', () => {
    const state = {
      pltWizard: {
        loading: false,
        panels: [
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939001311',
            orientation: 'lying',
            slope: null,
            x: -19.375,
            y: 20.625
          },
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939002888',
            orientation: 'lying',
            slope: null,
            x: -18.75,
            y: 21.25
          }
        ]
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
            SWVER: '2020.11, Build 8616',
            DEVICE_TYPE: 'PVS',
            DATATIME: '2020,11,10,22,54,49',
            dl_err_count: '0',
            dl_comm_err: '0',
            dl_skipped_scans: '0',
            dl_scan_time: '0',
            dl_untransmitted: '1261',
            dl_uptime: '1054',
            dl_cpu_load: '1.67',
            dl_mem_used: '69384',
            dl_flash_avail: '108702',
            panid: 453726776,
            CURTIME: '2020,11,10,22,54,49'
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
            DATATIME: '2020,11,10,22,54,49',
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
            CURTIME: '2020,11,10,22,54,50'
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
            DATATIME: '2020,11,10,22,54,50',
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
            CURTIME: '2020,11,10,22,54,50'
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0019',
            v_mppt1_v: '48.15',
            i_mppt1_a: '0.04',
            t_htsnk_degc: '29',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0008',
            v_mppt1_v: '48.18',
            i_mppt1_a: '0.01',
            t_htsnk_degc: '26',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
          }
        ]
      }
    }

    const { store } = configureStore(state)

    return (
      <div id="modal-root" className="full-min-height pt-20 pl-10 pr-10">
        <Provider store={store}>
          <PanelLayoutWidget />
        </Provider>
      </div>
    )
  })
  .add('panelLayoutWidget with SI + MI', () => {
    const state = {
      pltWizard: {
        loading: false,
        panels: [
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939001311',
            orientation: 'lying',
            slope: null,
            x: -19.375,
            y: 20.625
          },
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939002888',
            orientation: 'lying',
            slope: null,
            x: -18.75,
            y: 21.25
          }
        ]
      },
      devices: {
        found: [
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0019',
            v_mppt1_v: '48.15',
            i_mppt1_a: '0.04',
            t_htsnk_degc: '29',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
          },
          {
            ISDETAIL: true,
            SERIAL: 'E00121939002888',
            TYPE: 'SOLARBRIDGE',
            STATE: 'working',
            STATEDESCR: 'Working',
            MODEL: 'String Inverter',
            DESCR: 'Inverter E00121939002888',
            DEVICE_TYPE: 'Inverter',
            PANEL: 'SPR-E19-320-E-AC',
            SWVER: '4.14.5',
            PORT: '',
            MOD_SN: '',
            NMPLT_SKU: '',
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0019',
            v_mppt1_v: '48.15',
            i_mppt1_a: '0.04',
            t_htsnk_degc: '29',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0008',
            v_mppt1_v: '48.18',
            i_mppt1_a: '0.01',
            t_htsnk_degc: '26',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
          },
          {
            ISDETAIL: true,
            SERIAL: 'E00121939001314',
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0008',
            v_mppt1_v: '48.18',
            i_mppt1_a: '0.01',
            t_htsnk_degc: '26',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
          }
        ]
      },
      stringInverters: {
        newDevices: [{ SERIAL: '0000001' }]
      }
    }

    const { store } = configureStore(state)

    return (
      <div id="modal-root" className="full-min-height pt-20 pl-10 pr-10">
        <Provider store={store}>
          <PanelLayoutWidget />
        </Provider>
      </div>
    )
  })
  .add('panelLayoutWidget with only SI', () => {
    const state = {
      pltWizard: {
        loading: false,
        panels: [
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939001311',
            orientation: 'lying',
            slope: null,
            x: -19.375,
            y: 20.625
          },
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939002888',
            orientation: 'lying',
            slope: null,
            x: -18.75,
            y: 21.25
          }
        ]
      },
      devices: {
        found: []
      },
      stringInverters: {
        newDevices: [{ SERIAL: '0000001' }]
      }
    }

    const { store } = configureStore(state)

    return (
      <div id="modal-root" className="full-min-height pt-20 pl-10 pr-10">
        <Provider store={store}>
          <PanelLayoutWidget />
        </Provider>
      </div>
    )
  })
  .add('RSE Widget w/ String Inverters', () => {
    const state = {
      stringInverters: {
        newDevices: [{ SERIAL: '0000001' }]
      }
    }
    const { store } = configureStore(state)

    return (
      <div id="modal-root" className="full-min-height pt-20 pb-20 pl-10 pr-10">
        <Provider store={store}>
          <RSEWidget />
        </Provider>
      </div>
    )
  })
  .add('Page', () => {
    const state = {
      pltWizard: {
        loading: false,
        lastModifiedDate: '2020-11-10T23:05:59.908Z',
        panels: [
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939001311',
            orientation: 'lying',
            slope: null,
            x: -19.375,
            y: 20.625
          },
          {
            azimuth: null,
            groupKey: null,
            id: 'E00121939002888',
            orientation: 'lying',
            slope: null,
            x: -18.75,
            y: 21.25
          }
        ]
      },
      devices: {
        found: [
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0019',
            v_mppt1_v: '48.15',
            i_mppt1_a: '0.04',
            t_htsnk_degc: '29',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0008',
            v_mppt1_v: '48.18',
            i_mppt1_a: '0.01',
            t_htsnk_degc: '26',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
          },
          {
            ISDETAIL: true,
            SERIAL: 'E00121939001314',
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
            DATATIME: '2020,11,10,22,54,49',
            ltea_3phsum_kwh: '0',
            p_3phsum_kw: '0',
            vln_3phavg_v: '0',
            i_3phsum_a: '0',
            p_mppt1_kw: '0.0008',
            v_mppt1_v: '48.18',
            i_mppt1_a: '0.01',
            t_htsnk_degc: '26',
            freq_hz: '155.39',
            stat_ind: '0',
            origin: 'data_logger',
            OPERATION: 'noop',
            CURTIME: '2020,11,10,22,54,51'
          }
        ]
      }
    }

    const { store } = configureStore(state)

    return (
      <div id="modal-root" className="full-min-height pt-20 pb-20 pl-10 pr-10">
        <Provider store={store}>
          <SystemConfiguration />
        </Provider>
      </div>
    )
  })
