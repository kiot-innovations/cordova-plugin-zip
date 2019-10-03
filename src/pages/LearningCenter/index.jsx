import React from 'react'
import clsx from 'clsx'
import ModalLayout from '../../components/ModalLayout'
import { useI18n } from '../../shared/i18n'

function LearningCenter({ history, location, className }) {
  const t = useI18n()
  const classes = clsx('learning-center-modal', className)
  return (
    <ModalLayout
      className={classes}
      history={history}
      title={t('LEARNING_CENTER')}
      from={location && location.state && location.state.from}
      hasBackButton
    />
  )
}

export default LearningCenter
