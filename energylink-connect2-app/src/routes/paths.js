/**
 * To add a new route just add an object to the PROTECTED or UNPROTECTED
 * The object MUST have a path property
 * optional, the `header` and `footer`
 * The go to ./index and update the mapComponents variable to have your component working
 */
const paths = {
  PROTECTED: {
    ROOT: {
      path: '/',
      header: true
    },
    CREATE_SITE: {
      path: '/create-site',
      header: true
    },
    MENU: { path: '/menu', header: true },
    MANAGE_FIRMWARES: { path: '/manage-firmwares' },
    VERSION_INFORMATION: { path: '/version-information' },
    GIVE_FEEDBACK: { path: '/give-feedback' },
    PVS_CONNECTION_SUCCESS: {
      path: '/pvs-connection-success',
      header: true
    },
    LOGOUT: { path: '/logout' }
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
