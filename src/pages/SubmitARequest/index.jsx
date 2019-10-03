import React from 'react'
import clsx from 'clsx'
import ModalLayout from '../../components/ModalLayout'
import { useI18n } from '../../shared/i18n'

function SubmitARequest({ history, location, className }) {
  const t = useI18n()
  const classes = clsx('submit-a-request-modal', className)
  return (
    <ModalLayout
      className={classes}
      history={history}
      title={t('SUBMIT_A_REQUEST')}
      from={location && location.state && location.state.from}
      hasBackButton
    />
  )
}

export default SubmitARequest
