import moment from 'moment'
import React, { useEffect, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { validateSession } from '../../state/actions/auth'
// import { pollAlerts } from '../../state/actions/alerts'
import { pollEnergyData, INTERVALS } from '../../state/actions/energy-data'
import { getWifiCollector } from '../../state/actions/wifi'
import { deviceResumeListener } from '../../state/actions/mobile'
import paths from '../Router/paths'

export default function PrivateRoute({ isLoggedIn, ...props }) {
  const OriginalComponent = props.component
  const location = props.location
  const dispatch = useDispatch()

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(deviceResumeListener())
      dispatch(validateSession())
      // TODO: uncomment this after SPI
      // dispatch(pollAlerts())
      dispatch(getWifiCollector())
      dispatch(pollEnergyData(INTERVALS.HOUR))
      dispatch(
        pollEnergyData(
          INTERVALS.DAY,
          moment()
            .subtract(1, 'month')
            .valueOf()
        )
      )
      dispatch(
        pollEnergyData(
          INTERVALS.MONTH,
          moment()
            .subtract(1, 'year')
            .valueOf()
        )
      )
      // Add more long running services here
    }
  })

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  })

  return (
    <Route
      {...props}
      component={innerProps =>
        isLoggedIn ? (
          <OriginalComponent {...innerProps} />
        ) : (
          <Redirect
            to={{
              pathname: paths.LOGIN,
              state: {
                from:
                  location.pathname === paths.LOGIN
                    ? paths.ROOT
                    : location.pathname
              }
            }}
          />
        )
      }
    />
  )
}
