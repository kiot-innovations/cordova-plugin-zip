import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import moment from 'moment-timezone'
import paths from './paths'
import PrivateRoute from '../PrivateRoute'
import Login from '../Login'
import Signup from '../Signup'
import SignupSerial from '../SignupSerial'
import SignupPassword from '../SignupPassword'
import SignupLoader from '../SignupLoader'
import Home from '../Home'
import Storage from '../Storage'
import History from '../History'
import NotFound from '../NotFound'
import HelpSerial from '../HelpSerial'
import Menu from '../Menu'
import SocialShare from '../SocialShare'
import Notifications from '../Notifications'
import HelpCenter from '../HelpCenter'
import LearningCenter from '../LearningCenter'
import PartnerProgram from '../PartnerProgram'
import WifiSettings from '../WifiSettings'
import Feedback from '../Feedback'
import BatterySettings from '../BatterySettings'
import NewProducts from '../NewProducts'
import Faq from '../Faq'
import Documents from '../Documents'
import SubmitARequest from '../SubmitARequest'
import ForgotPassword from '../ForgotPassword'
import ForgotPasswordSent from '../ForgotPasswordSent'
import ForgotPasswordFailed from '../ForgotPasswordFailed'
import ResetPassword from '../ResetPassword'
import UpdatePassword from '../UpdatePassword'
import AboutWifi from '../AboutWifi'
import Profile from '../Profile'
import Settings from '../Settings'

import { withTracker } from '../../shared/ga'

function RouterComponent() {
  const Router = process.env.REACT_APP_IS_MOBILE
    ? require('react-router-dom').HashRouter
    : require('react-router-dom').BrowserRouter

  const isLoggedIn = useSelector(
    state => state.user && state.user.auth && state.user.auth.userId >= 0
  )

  // Needed to keep fake data consistent
  moment.tz.setDefault('America/Chicago')

  return (
    <Router>
      <Switch>
        <PrivateRoute
          exact
          path={paths.ROOT}
          component={withTracker(Home)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.HISTORY}
          component={withTracker(History)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.STORAGE}
          component={withTracker(Storage)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.NOTIFICATIONS}
          component={withTracker(Notifications)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU}
          component={withTracker(Menu)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_SOCIAL_SHARE}
          component={withTracker(SocialShare)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_HELP_CENTER}
          component={withTracker(HelpCenter)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_LEARNING_CENTER}
          component={withTracker(LearningCenter)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_PARTNER_PROGRAM}
          component={withTracker(PartnerProgram)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_WIFI_SETTINGS}
          component={withTracker(WifiSettings)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_FEEDBACK}
          component={withTracker(Feedback)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_BATTERY_SETTINGS}
          component={withTracker(BatterySettings)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_NEW_PRODUCTS}
          component={withTracker(NewProducts)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.HELP_FAQ}
          component={withTracker(Faq)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.HELP_DOCUMENTS}
          component={withTracker(Documents)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.HELP_SUBMIT_A_REQUEST}
          component={withTracker(SubmitARequest)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_UPDATE_PASSWORD}
          component={withTracker(UpdatePassword)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.SETTINGS}
          component={withTracker(Settings)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.MENU_ABOUT_WIFI}
          component={withTracker(AboutWifi)}
          isLoggedIn={isLoggedIn}
        />
        <PrivateRoute
          exact
          path={paths.PROFILE}
          component={withTracker(Profile)}
          isLoggedIn={isLoggedIn}
        />
        <Route
          exact
          path={paths.LOGIN}
          component={withTracker(props => (
            <Login {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          exact
          path={paths.SIGNUP}
          component={withTracker(props => (
            <Signup {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          exact
          path={paths.SIGNUP_SERIAL}
          component={withTracker(props => (
            <SignupSerial {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          path={paths.SIGNUP_PASSWORD}
          component={withTracker(props => (
            <SignupPassword {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          path={paths.SIGNUP_LOADER}
          component={withTracker(props => (
            <SignupLoader {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          path={paths.HELP_SERIAL}
          component={withTracker(props => (
            <HelpSerial {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          path={paths.FORGOT_PASSWORD}
          component={withTracker(props => (
            <ForgotPassword {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          path={paths.FORGOT_PASSWORD_SENT}
          component={withTracker(props => (
            <ForgotPasswordSent {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          path={paths.FORGOT_PASSWORD_FAILED}
          component={withTracker(props => (
            <ForgotPasswordFailed {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          path={paths.RESET_PASSWORD}
          component={withTracker(props => (
            <ResetPassword {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
        <Route
          component={withTracker(props => (
            <NotFound {...props} isLoggedIn={isLoggedIn} />
          ))}
        />
      </Switch>
    </Router>
  )
}

export default RouterComponent
