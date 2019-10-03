import React from 'react'
import clsx from 'clsx'
import ModalLayout from '../../components/ModalLayout'
import { useI18n } from '../../shared/i18n'

function PartnerProgram({ history, location, className }) {
  const t = useI18n()
  const classes = clsx('partner-program-modal', className)
  return (
    <ModalLayout
      className={classes}
      history={history}
      title={t('PARTNER_PROGRAM')}
      from={location && location.state && location.state.from}
      hasBackButton
    />
  )
}

export default PartnerProgram
