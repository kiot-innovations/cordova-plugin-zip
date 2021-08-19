import clsx from 'clsx'
import { propOr } from 'ramda'
import React from 'react'

const TextInput = props => {
  return (
    <div className="control">
      <input
        className={clsx('input', propOr('', 'className', props))}
        type={propOr('text', 'type', props)}
        {...props}
      />
    </div>
  )
}
export default TextInput
