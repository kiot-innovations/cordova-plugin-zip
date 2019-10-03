import React from 'react'
import { useI18n } from '../../shared/i18n'
import { ReferIcon } from './icons'

import './ReferAFriend.scss'

function ReferAFriend() {
  const t = useI18n()
  const reward = 100
  return (
    <div className="refer-a-friend is-flex">
      <ReferIcon />
      <h1 className="is-uppercase refer-a-friend-title">
        {t('REFER_A_FRIEND_TITLE')}
      </h1>
      <h1 className="is-uppercase is-size-4 refer-a-friend-bounty">
        {t('REFER_A_FRIEND_BOUNTY', reward)}
      </h1>
      <h1 className="refer-a-friend-separator">-</h1>
      <h1 className="refer-a-friend-description is-7">
        {t('REFER_A_FRIEND_DESCRIPTION', reward)}
      </h1>
      <a href="/" className="is-uppercase">
        {t('REFER_A_FRIEND_BUTTON')}
      </a>
    </div>
  )
}

export default ReferAFriend
