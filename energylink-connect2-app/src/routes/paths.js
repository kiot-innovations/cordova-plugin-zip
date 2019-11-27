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
      footer: true
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
    GIVE_FEEDBACK: { path: '/give-feedback' },
    PVS_CONNECTION_SUCCESS: {
      path: '/pvs-connection-success',
      header: true
    },
    LOGOUT: { path: '/logout' },
    INVENTORY_COUNT: { path: '/inventory-count', header: true }
  },
  UNPROTECTED: {
    LOGIN: {
      path: '/login'
    },
    FORGOT_PASSWORD: {
      path: '/forgot'
    },
    GET_ASSISTANCE: {
      path: '/assistance'
    }
  }
}

export default paths