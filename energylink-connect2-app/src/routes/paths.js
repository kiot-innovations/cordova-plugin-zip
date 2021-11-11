export const TABS = {
  HOME: 'HOME',
  INSTALL: 'INSTALL',
  DATA: 'DATA',
  CONFIGURE: 'CONFIGURE'
}
/**
 * To add a new route just add an object to the PROTECTED or UNPROTECTED
 * The object MUST have a path property
 * optional, the `header` and `footer`
 * The go to ./index and update the mapComponents variable to have your component working
 */
const paths = {
  PROTECTED: {
    PVS_SELECTION_SCREEN: {
      path: '/pvs-selection',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    ERROR_DETAIL: {
      path: '/error/:errorCode',
      header: true,
      footer: false
    },
    BILL_OF_MATERIALS: {
      path: '/bill-of-materials',
      header: true,
      footer: true,
      tab: TABS.HOME
    },
    PANEL_LAYOUT_TOOL: {
      path: '/panel-layout-tool',
      header: true,
      footer: true,
      tab: TABS.CONFIGURE
    },
    PANEL_LAYOUT_TOOL_GROUPS: {
      path: '/panel-layout-tool-groups',
      header: true,
      footer: true,
      tab: TABS.CONFIGURE
    },
    UPDATE: {
      path: '/update-in-progress',
      header: true
    },
    DEVICES: {
      path: '/devices',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    LEGACY_DISCOVERY: {
      path: '/legacy-discovery',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    MODEL_EDIT: {
      path: '/model-edit',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    ROOT: {
      path: '/',
      header: true
    },
    CREATE_SITE: {
      path: '/create-site',
      header: true
    },
    MANAGE_FIRMWARES: {
      path: '/manage-firmwares',
      header: true
    },
    VERSION_INFORMATION: {
      path: '/version-information',
      header: true
    },
    GIVE_FEEDBACK: {
      path: '/give-feedback',
      header: true
    },
    PVS_CONNECTION_SUCCESS: {
      path: '/pvs-connection-success',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    PVS_PROVIDE_INTERNET: {
      path: '/pvs-provide-internet',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    CONFIGURE_STRING_INVERTER: {
      path: '/configure-string-inverter',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    ADD_STRING_INVERTERS: {
      path: '/add-string-inverters',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    INSTALL_SUCCESS: {
      path: '/install-success',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    CONNECT_TO_PVS: {
      path: '/connect-to-pvs',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    SCAN_LABELS: {
      path: '/scan-labels',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    SN_LIST: {
      path: '/sn-list',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    EQS_UPDATE: {
      path: '/eqs-update',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    EQS_UPDATE_ERRORS: {
      path: '/eqs-update-errors',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    STORAGE_PREDISCOVERY: {
      path: '/storage-prediscovery',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    EQS_PREDISCOVERY_ERRORS: {
      path: '/eqs-prediscovery-errors',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    SYSTEM_CONFIGURATION: {
      path: '/system-configuration',
      header: true,
      footer: true,
      tab: TABS.CONFIGURE
    },
    SAVING_CONFIGURATION: {
      path: '/saving-configuration',
      header: true,
      footer: true,
      tab: TABS.CONFIGURE
    },
    CONNECTION_LOST: {
      path: '/connection-lost',
      header: true
    },
    DATA: {
      path: '/data',
      header: true,
      footer: true,
      tab: TABS.DATA
    },
    ESS_DEVICE_MAPPING: {
      path: '/ess-device-mapping',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    ESS_DEVICE_MAPPING_ERROR: {
      path: '/ess-device-mapping-error',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    ESS_DEVICE_MAPPING_SUCCESS: {
      path: '/ess-device-mapping-success',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    ESS_DEVICE_MAPPING_ERROR_LIST: {
      path: '/ess-device-mapping-error-list',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    ESS_HEALTH_CHECK: {
      path: '/ess-health-check',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    DEBUG_PAGE: {
      path: '/debug',
      header: true
    },
    ESS_HEALTH_CHECK_ERRORS: {
      path: '/ess-health-check-errors',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    RMA_EXISTING_DEVICES: {
      path: '/rma-existing-devices',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    FIRMWARE_DOWNLOAD: {
      path: '/firmware',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    RMA_INVENTORY: {
      path: '/rma-inventory',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    RMA_SN_LIST: {
      path: '/rma-sn-list',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    RMA_MI_DISCOVERY: {
      path: '/rma-mi-discovery',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    RMA_DEVICES: {
      path: '/rma-devices',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    PERMISSIONS: {
      path: '/permissions',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    PRECOMM_CHECKLIST: {
      path: '/precommissioning-checklist',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    NEARBY_PVS: {
      path: '/nearbyPVS',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    SETTINGS: {
      path: '/app-settings',
      header: true
    },
    PRECOMMISSIONING_CONFIGS: {
      path: '/precommissioning-configs',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    SYSTEM_CHECKS: {
      path: '/system-checks',
      header: true,
      footer: true,
      tab: TABS.CONFIGURE
    },
    SYSTEM_CHECKS_ERROR_LIST: {
      path: '/system-checks-error-list',
      header: true,
      footer: false,
      tab: TABS.CONFIGURE
    },
    LEGACY_DISCOVERY_SELECTOR: {
      path: '/legacy-discovery-selector',
      header: true,
      footer: true,
      tab: TABS.INSTALL
    },
    KNOWLEDGE_BASE: {
      path: '/knowledge-base',
      header: true
    },
    QUICKSTART_GUIDES: {
      path: '/quickstart-guides',
      header: true
    },
    TUTORIAL_VIDEOS_LIST: {
      path: '/tutorial-videos-list',
      header: true
    },
    TUTORIAL_VIDEO: {
      path: '/tutorial-video',
      header: true
    }
  },
  UNPROTECTED: {
    LOGIN: {
      path: '/login'
    },
    FORGOT_PASSWORD: {
      path: '/forgot'
    },
    GET_ASSISTANCE: {
      path: '/assistance',
      headers: true
    },
    ANALYTICS_CONSENT: {
      path: '/analytics-consent'
    }
  }
}
export const protectedRoutes = Object.values(paths.PROTECTED)
export default paths
export const setParams = (params, url) =>
  url
    .split(':')
    .map((elem, i) => (i > 0 ? params[i - 1] : elem))
    .join('')
