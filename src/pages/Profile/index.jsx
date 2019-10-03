import React from 'react'
import { useSelector } from 'react-redux'
import { useI18n } from '../../shared/i18n'
import ProfileLabel from '../../components/ProfileLabel'
import ModalLayout from '../../components/ModalLayout'
import Reports from '../../components/Reports'
import Logout from '../../components/Logout'

import paths from '../Router/paths'

function Profile({ location, history }) {
  const t = useI18n()

  const { firstName, lastName, phoneNumber, emailAddress } = useSelector(
    state => state.user && state.user.data
  )

  return (
    <ModalLayout
      history={history}
      title={t('PROFILE')}
      from={location && location.state && location.state.from}
    >
      <ProfileLabel
        title={t('PLACEHOLDER_NAME')}
        content={`${firstName} ${lastName}`}
        to=""
      />
      <ProfileLabel
        title={t('PLACEHOLDER_EMAIL')}
        content={emailAddress}
        to=""
      />
      <ProfileLabel
        title={t('PLACEHOLDER_PHONE')}
        content={phoneNumber}
        to=""
      />
      <ProfileLabel
        title={t('PLACEHOLDER_PASSWORD')}
        content="••••••••••"
        to={paths.MENU_UPDATE_PASSWORD}
      />
      <div className="content pt-40">
        <Reports />
      </div>
      <div className="content mt-20 mb-40 file is-centered">
        <Logout />
      </div>
    </ModalLayout>
  )
}

export default Profile
