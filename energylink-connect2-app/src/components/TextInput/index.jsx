import clsx from 'clsx'
import { propOr } from 'ramda'
import React from 'react'

import './TextInput.scss'
import { either } from '../../shared/utils'

const TextInput = props => {
  return (
    <div className="control">
      <input
        className={clsx('input', propOr('', 'className', props))}
        type={propOr('text', 'type', props)}
        {...props}
      />
      {either(
        props.loading,
        <div className="lds-ripple">
          <div />
          <div />
        </div>
      )}
      {either(
        props.icon,
        <i className={clsx('sp has-text-grey-lighter', props.icon)} />
      )}
    </div>
  )
}
export default TextInput
