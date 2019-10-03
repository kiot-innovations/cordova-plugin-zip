import React from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import ModalLayout from '../../components/ModalLayout'
import { useI18n } from '../../shared/i18n'
import ModalNotification from '../../components/ModalNotification'
import { ALERTS_SEEN } from '../../state/actions/alerts'
import { CloudRain } from '../../components/Icons'

import './Notifications.scss'

function renderAlerts(t, alerts) {
  return alerts
    .sort((a, b) => {
      return moment(a.AlertStartTimeUTC).isAfter(moment(b.AlertStartTimeUTC))
        ? -1
        : 1
    })
    .map(alert => {
      const title = t('ALERT_TITLE_TYPE_' + alert.AlertTypeID)
      const description = t('ALERT_TITLE_DESCRIPTION_' + alert.AlertTypeID)
      return (
        <ModalNotification
          key={alert.AlertsID}
          id={alert.AlertsID}
          date={moment(alert.AlertStartTimeUTC)}
          removable={[998, 999].indexOf(alert.AlertsID) === -1} // TODO: remove this after SPI
        >
          <div className="is-flex level file is-centered pl-20 pr-20">
            {[998, 999].indexOf(alert.AlertsID) > -1 ? ( // TODO: remove this after SPI
              <div className="mr-5">
                <CloudRain />
              </div>
            ) : null}
            <span className="has-text-centered is-size-6 has-text-weight-bold has-text-black">
              {title}
            </span>
          </div>
          <div>{description}</div>
        </ModalNotification>
      )
    })
}

function Notifications({ location, history }) {
  const t = useI18n()
  const dispatch = useDispatch()
  const alerts = useSelector(state => state.alerts.data)
  let alertsList = Object.keys(alerts)
    .map(k => alerts[k])
    .filter(alert => !alert.dismissed)

  // TODO: remove this after SPI
  alertsList = alertsList.concat([
    {
      AlertsID: 999,
      AlertTypeID: 999,
      AlertStartTimeUTC: 1569165360000
    },
    {
      AlertsID: 998,
      AlertTypeID: 999,
      AlertStartTimeUTC: 1566450000000,
      seenTimestamp: 1566450000000
    }
  ])

  const unseenAlerts = alertsList.filter(a => !a.seenTimestamp)
  const seenAlerts = alertsList.filter(a => a.seenTimestamp)

  return (
    <ModalLayout
      className="notifications"
      history={history}
      title={t('NOTIFICATIONS')}
      from={location && location.state && location.state.from}
      onClose={() => dispatch(ALERTS_SEEN())}
    >
      {unseenAlerts.length > 0 && (
        <div className="label">{t('MOST_RECENT')}</div>
      )}
      {renderAlerts(t, unseenAlerts)}
      {seenAlerts.length > 0 && <div className="label">{t('OLDER')}</div>}
      {renderAlerts(t, seenAlerts)}
      {unseenAlerts.length === 0 && seenAlerts.length === 0 && (
        <div className="no-notifications has-text-centered mt-100">
          <h2>{t('NO_NOTIFICATIONS_TITLE')}</h2>
          <div className="dash">-</div>
          <p className="pl-20 pr-20">{t('NO_NOTIFICATIONS_TEXT')}</p>
        </div>
      )}
    </ModalLayout>
  )
}

export default Notifications
