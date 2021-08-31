import {
  allPass,
  compose,
  filter,
  includes,
  not,
  split,
  startsWith
} from 'ramda'

export const SITE_STATES = {
  NEED_SUNVAULT: 'NEED_SUNVAULT',
  NEED_INSTALL: 'NEED_INSTALL',
  IS_COMMISSIONED: 'IS_COMMISSIONED'
}

const hasStorage = siteRaw => siteRaw.strg_sys_sz_kwh > 0
const isCommissioned = siteRaw => siteRaw.pvs_count > 0
const isPVS = allPass([startsWith('ZT'), compose(not, includes('dcm'))])
const getPVSList = compose(filter(isPVS), split(','))

export const getSitePayload = siteRaw => ({
  name: siteRaw.site_addr_nm,
  address: `${siteRaw.st_addr_lbl}, ${siteRaw.st_id}, ${siteRaw.pst_zone_id}`,
  financeType: siteRaw.fin_ty_enum || 'N/A',
  contractNo: siteRaw.cntrc_no || 'N/A',
  pvsCount: siteRaw.pvs_count,
  snList: siteRaw.sn_list ? getPVSList(siteRaw.sn_list) : [],
  systemSize: hasStorage(siteRaw)
    ? `${siteRaw.strg_sys_sz_kwh / 1000}kW`
    : 'N/A',
  isCommissioned: isCommissioned(siteRaw),
  hasStorage: hasStorage(siteRaw),
  ...siteRaw
})

const needSunVault = siteRaw =>
  !isCommissioned(siteRaw) && siteRaw.pvs_type === 'Aggregate'

export const getSiteState = (siteRaw, states = SITE_STATES) => {
  if (isCommissioned(siteRaw)) {
    return SITE_STATES.IS_COMMISSIONED
  }
  return needSunVault(siteRaw)
    ? SITE_STATES.NEED_SUNVAULT
    : SITE_STATES.NEED_INSTALL
}
