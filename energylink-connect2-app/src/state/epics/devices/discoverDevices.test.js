import { of } from 'rxjs'
import {
  FETCH_CANDIDATES_COMPLETE,
  DISCOVER_UPDATE
} from 'state/actions/devices'
import scanDevicesEpic from 'state/epics/devices/discoverDevices'
import * as apis from 'shared/api'

describe('the discover device epic', () => {
  let action
  let action$
  let epic$
  let mockStartDiscovery
  let mockGetProgress
  let mockGetDevices
  let payload
  let update

  beforeEach(() => {
    action = FETCH_CANDIDATES_COMPLETE()
    action$ = of(action)
    epic$ = scanDevicesEpic(action$)
    payload = [{ TYPE: 'Inverter', NFOUND: 10 }]
    update = DISCOVER_UPDATE(payload)
    mockStartDiscovery = jest.fn()
    mockGetDevices = jest.fn().mockResolvedValue({
      body: [
        {
          DETAIL: 'detail',
          STATE: 'working',
          STATEDESCR: 'Working',
          SERIAL: 'ZT188585000882A8888',
          MODEL: 'PV Supervisor PVS6',
          HWVER: '0',
          SWVER: '5.0.0, Build 326',
          DEVICE_TYPE: 'PVS',
          DATATIME: '2017,09,15,03,08,07',
          dl_err_count: '0',
          dl_comm_err: '0',
          dl_skipped_scans: '0',
          dl_scan_time: '0',
          dl_untransmitted: '139302',
          dl_uptime: '733882',
          dl_cpu_load: '0.51',
          dl_mem_used: '28544',
          dl_flash_avail: '2420',
          panid: 2969109406,
          CURTIME: '2017,09,15,03,08,22',
          stat_ind: 0,
          p_3phsum_kw: '0.397',
          i_3phsum_a: '1.39',
          vln_3phavg_v: 241,
          i_mppt1_a: '9.99',
          v_mppt1_v: '40.00',
          p_mpptsum_kw: '0.400',
          freq_hz: '60.0',
          t_htsnk_degc: 102
        },
        {
          ISDETAIL: true,
          SERIAL: 'PVS6M18450016p',
          TYPE: 'PVS5-METER-P',
          STATE: 'working',
          STATEDESCR: 'Working',
          MODEL: 'PVS6M0400p',
          DESCR: 'Power Meter PVS6M18450016p',
          DEVICE_TYPE: 'Power Meter',
          SWVER: '3000',
          PORT: '',
          DATATIME: '2019,05,22,19,32,40',
          ct_scl_fctr: '175',
          net_ltea_3phsum_kwh: '0',
          p_3phsum_kw: '0.399',
          q_3phsum_kvar: '0',
          s_3phsum_kva: '0',
          tot_pf_rto: '1',
          freq_hz: '59.9',
          CAL0: '175',
          origin: 'data_logger',
          OPERATION: 'noop',
          CURTIME: '2019,05,22,19,32,40',
          stat_ind: 0,
          i_3phsum_a: '1.41',
          vln_3phavg_v: 243,
          i_mppt1_a: '9.99',
          v_mppt1_v: '40.00',
          p_mpptsum_kw: '0.400',
          t_htsnk_degc: 101
        }
      ]
    })
    mockGetProgress = jest
      .fn()
      .mockResolvedValueOnce({
        body: {
          complete: false,
          progress: payload
        }
      })
      .mockResolvedValue({
        body: {
          complete: true,
          progress: payload
        }
      })

    jest.spyOn(apis, 'getApiPVS').mockImplementation(() => {
      return {
        apis: {
          devices: {
            getDevices: mockGetDevices
          },
          discovery: {
            getDiscoveryProgress: mockGetProgress,
            startDiscovery: mockStartDiscovery
          }
        }
      }
    })
  })

  it('should update the data once its completed', done => {
    epic$.subscribe(returnedAction => {
      if (returnedAction.type === update.type) {
        expect(mockGetProgress).toBeCalledTimes(1)
      } else {
        expect(mockGetProgress).toBeCalledTimes(1)
        done()
      }
    })
  })
})
