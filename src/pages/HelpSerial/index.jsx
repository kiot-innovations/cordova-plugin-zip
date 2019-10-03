import React from 'react'
import clsx from 'clsx'
import ModalLayout from '../../components/ModalLayout'
import ModalItem from '../../components/ModalItem'
import paths from '../Router/paths'
import './HelpSerial.scss'

function HelpSerial({ history, className }) {
  const classes = clsx('help-serial', className)
  return (
    <ModalLayout
      className={classes}
      history={history}
      title="Device serial number"
      from={paths.SIGNUP_SERIAL}
    >
      <ModalItem
        overtitle="We need a monitoring device serial number to create your account"
        title="You may have received this:"
      >
        <ul>
          <li>In a welcome email from sunpower</li>
          <li>add more</li>
        </ul>
      </ModalItem>
    </ModalLayout>
  )
}

export default HelpSerial
