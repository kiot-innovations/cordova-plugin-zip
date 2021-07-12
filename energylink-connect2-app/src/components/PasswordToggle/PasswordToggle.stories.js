import { storiesOf } from '@storybook/react'
import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import PasswordToggle from './index'

function Pass() {
  const { form } = useForm({
    onSubmit: console.info,
    validate: console.info
  })

  const email = useField('email', form)
  return (
    <div className="column">
      <PasswordToggle
        input={email.input}
        meta={email.meta}
        autocomplete="off"
      />
    </div>
  )
}

storiesOf('PasswordToggle', module).add('Simple', () => <Pass />)
