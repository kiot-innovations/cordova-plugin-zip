import { storiesOf } from '@storybook/react'
import { clone } from 'ramda'
import React from 'react'

import SiteCard from './'

import { toUISite } from 'state/epics/site/fetchSitesEpic'

export const siteCardMock = {
  city_id: 'San Antonio',
  cmnty_id: 'Vineyard Point',
  cntry_id: 'US',
  cnty_id: 'Sacramento',
  cntrc_no: '2404819',
  dsgn_sys_sz_w: 2869,
  elev_val: '183.21 feet',
  env_ty: 'Suburban',
  etl_job_no: 'MDS-JOB_402',
  etl_load_ts: 1590182646678,
  fin_ty_enum: 'Cash',
  homeowners_count: 1,
  lat_deg: 37.283535,
  long_deg: -121.756,
  pvs_count: 3,
  rec_crt_by: 'example.employee@example.com',
  rec_crt_ts: 1590182646678,
  rec_del_by: 'example.employee@example.com',
  rec_del_ts: 1590182646678,
  rec_upd_by: 'example.employee@example.com',
  rec_upd_ts: 1590182646678,
  pst_zone_id: '95135',
  site_addr_nm: 'Smith, Terry',
  site_key: 'A_12345',
  site_srvy_cmplt_fl: false,
  site_ty: 'RESIDENTIAL',
  src_sys_id: 'SMS',
  src_sys_rec_id: '12345',
  st_addr_lbl: '2701 Scenic Meadow Court',
  st_id: 'CA',
  stat_ind: 'ACTIVE',
  strg_sys_sz_kwh: 0,
  tm_zone_id: 'US/Pacific',
  root_path_list: 'AC_12345, AC_45667, SPWR_PARTNER, SUNPOWER_GLOBAL',
  party_fn_list: 'John, Chris, Edward',
  party_ln_list: 'Smith, Lopez, Thompson',
  party_org_nm_list: 'Gabi Solar, SolarMax, UltraSolar',
  party_eml_list:
    'mothtest4@gmail.com,pvs5_test4@outlook.com,ma@gmail.com,pvg3@outlook.com,owlflytest@outlook.com',
  party_rel_ty_list: 'OWNER,SERVICER',
  party_ty_list: 'INDIVIDUAL, ORGANIZATION, PARTNER',
  sn_list: '000000F22200, 000000F22201, 000000F22202',
  attached_party_id_list:
    '2852ce1b-5f41-4769-9d18-6bfd2b6c70aa,U_261407,U_129897,8f157e75-3e08-47ce-a960-82f66fdfc12f,0012T00001dce6EQAQ',
  pvsSN: 'ZT1234567890123'
}

storiesOf('SiteCard', module)
  .add('Site Commissioned', () => {
    return (
      <div className="full-min-height ml-20 mr-20 mt-20 mb-20">
        <SiteCard {...toUISite(siteCardMock)} />
      </div>
    )
  })
  .add('Site Commissioned without Storage', () => {
    const siteWSC = clone(siteCardMock)
    siteWSC.strg_sys_sz_kwh = null
    return (
      <div className="full-min-height ml-20 mr-20 mt-20 mb-20">
        <SiteCard {...toUISite(siteWSC)} />
      </div>
    )
  })
  .add('Site Not Commissioned Needs Storage', () => {
    const siteWOSC = clone(siteCardMock)
    siteWOSC.pvs_type = 'Aggregate'
    siteWOSC.pvs_count = 0
    siteWOSC.strg_sys_sz_kwh = 13000
    return (
      <div className="full-min-height ml-20 mr-20 mt-20 mb-20">
        <SiteCard {...toUISite(siteWOSC)} />
      </div>
    )
  })
  .add('Site Commissioned with storage', () => {
    const siteWSC = clone(siteCardMock)
    siteWSC.comm_strg_sys_sz_kwh = 13
    siteWSC.sys_sz_w = 1675

    return (
      <div className="full-min-height ml-20 mr-20 mt-20 mb-20">
        <SiteCard {...toUISite(siteWSC)} />
      </div>
    )
  })
  .add('Site Not Commissioned Dont Expect Storage', () => {
    const siteWOSC = clone(siteCardMock)
    siteWOSC.pvs_count = 0
    siteWOSC.strg_sys_sz_kwh = 0
    return (
      <div className="full-min-height ml-20 mr-20 mt-20 mb-20">
        <SiteCard {...toUISite(siteWOSC)} />
      </div>
    )
  })
