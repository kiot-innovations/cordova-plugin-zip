import React from 'react'
import { useForm, useField } from 'react-final-form-hooks'

import { storiesOf } from '@storybook/react'

import TextArea from './index'

function Text() {
  const { form } = useForm({
    onSubmit: console.info,
    validate: console.info
  })

  const email = useField('email', form)
  return (
    <div className="column">
      <TextArea
        input={email.input}
        meta={email.meta}
        placeholder="PLACEHOLD ME"
        type="email"
      />
    </div>
  )
}

storiesOf('TextField', module).add('Simple', () => <Text />)