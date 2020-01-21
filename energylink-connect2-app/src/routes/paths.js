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
    BILL_OF_MATERIALS: {
      path: '/bill-of-materials',
      header: true,
      footer: true,
      tab: TABS.HOME
    },
    DEVICES: {
      path: '/devices',
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
    MENU: { path: '/menu', header: true },
    MANAGE_FIRMWARES: { path: '/manage-firmwares', header: true },
    VERSION_INFORMATION: { path: '/version-information' },
    GIVE_FEEDBACK: { path: '/give-feedback', header: true },
    PVS_CONNECTION_SUCCESS: {
      path: '/pvs-connection-success',
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
      footer: true
    },
    LOGOUT: { path: '/logout' },
    INVENTORY_COUNT: { path: '/inventory-count', header: true },
    SYSTEM_CONFIGURATION: {
      path: '/system-configuration',
      header: true,
      footer: true,
      tab: TABS.CONFIGURE
    },
    DATA: { path: '/data', header: true, footer: true, tab: TABS.DATA }
  },
  UNPROTECTED: {
    LOGIN: {
      path: '/login'
    },
    LOGOUT: {
      path: '/logout'
    },
    FORGOT_PASSWORD: {
      path: '/forgot'
    },
    GET_ASSISTANCE: {
      path: '/assistance'
    }
  }
}
export const protectedRoutes = Object.values(paths.PROTECTED)
export default paths
