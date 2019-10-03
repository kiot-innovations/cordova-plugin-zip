import React from 'react'
import clsx from 'clsx'
import ModalLayout from '../../components/ModalLayout'
import { useI18n } from '../../shared/i18n'

function Feedback({ history, location, className }) {
  const t = useI18n()
  const classes = clsx('feedback-modal', className)
  return (
    <ModalLayout
      className={classes}
      history={history}
      title={t('GIVE_US_FEEDBACK')}
      from={location && location.state && location.state.from}
      hasBackButton
    />
  )
}

export default Feedback
