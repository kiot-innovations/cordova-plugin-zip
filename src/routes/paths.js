import { CreateSite, Home, Login } from 'pages'

export const paths = {
  PROTECTED: {
    ROOT: {
      path: '/',
      component: Home,
      header: true,
      footer: true
    },
    CREATE_SITE: {
      path: '/create-site',
      component: CreateSite,
      header: true
    }
  },
  UNPROTECTED: {
    LOGIN: {
      path: '/login',
      component: Login
    },
    FORGOT_PASSWORD: {
      path: '/forgot',
      component: Home
    },
    GET_ASSISTANCE: {
      path: '/assistance',
      component: Home
    }
  }
}
