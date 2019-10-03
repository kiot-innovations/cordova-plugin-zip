import React from 'react'
import clsx from 'clsx'
import ModalLayout from '../../components/ModalLayout'
import ModalItem from '../../components/ModalItem'
import { useI18n } from '../../shared/i18n'

import './AboutWifi.scss'

function AboutWifi({ history, location, className }) {
  const t = useI18n()
  const classes = clsx('about-wifi', className)
  return (
    <ModalLayout
      className={classes}
      history={history}
      title={t('ABOUT_WIFI')}
      from={location && location.state && location.state.from}
    >
      <ModalItem className="fit-screen pl-10 pr-10">
        <div className="mb-30">
          <h5 className="title is-7">{t('MY_WIFI_QUESTION1')}</h5>
          <p>{t('MY_WIFI_ANSWER1')}</p>
        </div>
        <div className="mb-30">
          <h5 className="title is-7">{t('MY_WIFI_QUESTION2')}</h5>
          <div>
            <ol>
              <li>{t('MY_WIFI_ANSWER2_PT1')}</li>
              <li>{t('MY_WIFI_ANSWER2_PT2')}</li>
              <li>{t('MY_WIFI_ANSWER2_PT3')}</li>
            </ol>
          </div>
        </div>
        <div className="mb-30">
          <h5 className="title is-7">{t('MY_WIFI_QUESTION3')}</h5>
          <p>{t('MY_WIFI_ANSWER3')}</p>
        </div>
      </ModalItem>
    </ModalLayout>
  )
}

export default AboutWifi
