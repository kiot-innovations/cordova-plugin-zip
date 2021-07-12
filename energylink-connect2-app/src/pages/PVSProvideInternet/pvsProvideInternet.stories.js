import { storiesOf } from '@storybook/react'
import React from 'react'
import { Provider } from 'react-redux'

import PVSProvideInternet from '.'

import { configureStore } from 'state/store'

const initialState = {
  pvs: {
    serialNumber: 'ZT191585000549A0355',
    wpsSupport: true
  },
  rma: {
    rmaMode: 'NONE',
    newEquipment: false,
    cloudDeviceTree: {
      fetching: false,
      error: '',
      devices: []
    },
    pvs: null,
    deletingMIs: false,
    deletingMIsError: false
  },
  site: {
    isFetching: true,
    isSaving: false,
    sites: [],
    site: {
      siteKey: 'A_404889',
      city: 'Big Sur',
      cmnty_id: null,
      cntry_id: 'US',
      cnty_id: null,
      elev_val: null,
      env_ty: null,
      latitude: 36,
      longitude: -122,
      rec_crt_by: 'SMS User',
      rec_crt_ts: 1606840568000,
      rec_del_by: null,
      rec_upd_by: 'SMS User',
      rec_upd_ts: 1606840568000,
      etl_job_no: 'MDS-JOB_402',
      etl_load_ts: 1606917626339,
      postalCode: '93920',
      siteName: 'Test site 201201 00',
      site_srvy_cmplt_fl: false,
      site_ty: 'RESIDENTIAL',
      address1: '9669 Sycamore Canyon Road',
      st_id: 'CA',
      stat_ind: 'ACTIVE',
      sys_sz_w: 0,
      tm_zone_id: null,
      src_sys_id: 'SMS',
      src_sys_rec_id: '404889',
      cntrc_no: null,
      fin_ty_enum: null,
      party_fn_list:
        ',Test,Test,Test,test,Test,Test,Test,Test,Test,Test,Test,test,Test,Test,Test,Test,Pero ,,Test,Test,Test,Test',
      party_ln_list:
        ',Test,Test,Test,test,Test,Test,Test,Test,Test,Test,Test,test,Test,Test,Test,Test,Pero ,,Test,Test,Test,Test',
      party_org_nm_list:
        'Gabi Solar,Test Test,Test Test,Test Test,test test,Test Test,Test Test,Test Test,Test Test,Test Test,Test Test,Test Test,test test,Test Test,Test Test,Test Test,Test Test,Pero  Pero ,Gabi Solar,Test Test,Test Test,Test Test,Test Test',
      party_eml_list:
        ',ettest@grr.la,et3@grr.la,et7@grr.la,devtrillo@gmail.com,et20@grr.la,et10@grr.la,et@grr.la,te2@grr.la,et13@grr.la,et6@grr.la,et2@grr.la,netflix@devtrillo.com,esteban@devtrillo.com,lzgweism@sharklasers.com,te1@grr.la,et11@grr.la,tevan0vihc@gmail.com,,et12@grr.la,et4@grr.la,et5@grr.la,et15@grr.la',
      party_rel_ty_list:
        'OTHER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,OWNER,SERVICER,OWNER,OWNER,OWNER,OWNER',
      party_ty_list:
        'ORGANIZATION,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,ORGANIZATION,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL,INDIVIDUAL',
      attached_party_id_list:
        'AC_991,515c004d-4fac-46ef-bb01-6c9f8b2e7219,b3ea0ccf-a3e7-4328-92a4-11e0ba91efe9,f75c9e40-3052-4e4f-a4c4-b0c2acedcdcb,e75fd1db-e785-4a09-8cee-0c473918c76a,a6d92469-6706-4b8a-9a8a-a01e457b24c5,a0397e19-ef44-4c85-9439-34979d6f952a,70b05ea2-46d1-45ed-b973-7a33fdf770f4,41c3ef2e-3fc5-47b0-855b-5132f652ed7b,18733074-830f-4681-81e1-7c1418e0d442,016bbb78-ea77-4519-a6e8-59035fa8e4b5,195cd46a-99aa-49d8-8e01-e2f1ca53aaa9,1a930476-7684-42a9-b3d1-3bf0eec51250,1f006b0c-7c98-489d-96bb-7bfd861532c2,5b875289-8630-4e7c-9510-5a21f817c381,b5d8269c-0295-4fb2-a4d6-e3de33f8e2ad,2c7d95f9-d5d4-42b2-bd77-9babdfb7351e,671f8c92-92e0-49c5-97f4-22e7a5632ca0,AC_991,ef07bec3-7611-4d72-88da-6206c9321133,ca53482f-2b8d-4e42-9268-a4fa3bc7684b,c658571a-a1ca-4636-ab17-68e4a4774a07,abf616f2-adeb-4b7b-9c2b-8662c9d6ec73',
      sn_list: 'null,null',
      devices: [],
      root_path_list:
        'AC_991,,SPWR_PARTNER,,SUNPOWER_GLOBAL|AC_2995,,SUNPOWER_GLOBAL|SPWR_PARTNER,,SUNPOWER_GLOBAL'
    },
    error: null,
    saveError: '',
    saveModal: false,
    mapViewSrc:
      'https://maps.googleapis.com/maps/api/staticmap?center=36,-122&zoom=19&size=320x320&key=AIzaSyDQw3_CY42OoC70LXehwBFUk-xb25DfCns&maptype=hybrid&markers=scale:1|blue|36,-122&scale=1',
    sitePVS: null,
    siteChanged: false,
    homeownerCreation: {
      complete: false,
      creating: false
    },
    _persist: {
      version: -1,
      rehydrated: true
    }
  },
  systemConfiguration: {
    network: {
      aps: [
        {
          ssid: 'PLANTA_BAJA',
          bssid: '0c:80:63:32:96:42',
          wps: 'none',
          frequency: '2412',
          rssi: '-37',
          attributes: 'wpa-psk',
          channel: '1'
        },
        {
          ssid: 'HOME-A34F',
          bssid: 'cc:35:40:bc:a3:4f',
          wps: 'none',
          frequency: '2412',
          rssi: '-76',
          attributes: 'wpa-psk',
          channel: '1'
        },
        {
          ssid: 'AXTEL XTREMO-F2B6',
          bssid: '62:02:71:77:f2:b7',
          wps: 'none',
          frequency: '2452',
          rssi: '-76',
          attributes: 'wpa-psk',
          channel: '9'
        },
        {
          ssid: 'DIRECT-tqM288x Series',
          bssid: '32:cd:a7:ee:78:e5',
          wps: 'none',
          frequency: '2452',
          rssi: '-78',
          attributes: 'wpa-psk',
          channel: '9'
        },
        {
          ssid: 'Totalplay-D8A3',
          bssid: '4c:f5:5b:34:66:e0',
          wps: 'none',
          frequency: '2462',
          rssi: '-85',
          attributes: 'wpa-psk',
          channel: '11'
        }
      ],
      selectedAP: {
        ssid: 'PLANTA_BAJA'
      },
      connectedToAP: {
        label: 'PLANTA_BAJA',
        value: 'PLANTA_BAJA',
        ap: {
          ssid: 'PLANTA_BAJA',
          bssid: '0c:80:63:32:96:42',
          wps: 'none',
          frequency: '2412',
          rssi: '-37',
          attributes: 'wpa-psk',
          channel: '1'
        }
      },
      isFetching: false,
      isConnecting: false,
      isConnected: true,
      errorFetching: null,
      errorConnecting: false,
      wpsConnectionStatus: 'idle'
    }
  },
  storage: {
    currentStep: '',
    prediscovery: {},
    componentMapping: {},
    deviceUpdate: {},
    updateProgress: 0,
    status: {
      waiting: false,
      results: null,
      error: null
    },
    error: '',
    loadingPrediscovery: false
  }
}

storiesOf('Pvs Provide Internet', module).add('no RMA', () => {
  const { store } = configureStore(initialState)

  return (
    <div className="full-min-height pl-10 pr-10">
      <Provider store={store}>
        <PVSProvideInternet />
      </Provider>
    </div>
  )
})
