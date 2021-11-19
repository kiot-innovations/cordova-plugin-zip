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

const hasStorage = siteRaw => siteRaw.comm_strg_sys_sz_kwh > 0
const expectsStorage = siteRaw => siteRaw.strg_sys_sz_kwh > 0

const isCommissioned = siteRaw => siteRaw.pvs_count > 0
const isPVS = allPass([startsWith('ZT'), compose(not, includes('dcm'))])
const getPVSList = compose(filter(isPVS), split(','))

export const getSitePayload = siteRaw => ({
  name: siteRaw.site_addr_nm,
  address: `${siteRaw.st_addr_lbl}, ${siteRaw.st_id}, ${siteRaw.pst_zone_id}`,
  address1: siteRaw.address1 ? siteRaw.address1 : siteRaw.st_addr_lbl,
  postalCode: siteRaw.postalCode ? siteRaw.postalCode : siteRaw.pst_zone_id,
  siteKey: siteRaw.site_key,
  financeType: siteRaw.fin_ty_enum || 'N/A',
  contractNo: siteRaw.cntrc_no || 'N/A',
  pvsCount: siteRaw.pvs_count,
  snList: siteRaw.sn_list ? getPVSList(siteRaw.sn_list) : [],
  systemSize: siteRaw.sys_sz_w ? `${siteRaw.sys_sz_w / 1000} kW` : 'N/A',
  isCommissioned: isCommissioned(siteRaw),
  hasStorage: hasStorage(siteRaw),
  expectsStorage: expectsStorage(siteRaw),
  ...siteRaw
})

export const getSiteAddress = siteRaw =>
  `${siteRaw.st_addr_lbl}, ${siteRaw.st_id}, ${siteRaw.pst_zone_id}`

const needSunVault = siteRaw =>
  !isCommissioned(siteRaw) && expectsStorage(siteRaw)

export const getSiteState = (siteRaw, states = SITE_STATES) => {
  if (isCommissioned(siteRaw)) {
    return SITE_STATES.IS_COMMISSIONED
  }
  return needSunVault(siteRaw)
    ? SITE_STATES.NEED_SUNVAULT
    : SITE_STATES.NEED_INSTALL
}
