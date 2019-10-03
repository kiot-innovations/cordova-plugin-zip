import React from 'react'
import clsx from 'clsx'
import './RadioButton.scss'

function RadioButton({
  id = 'radio-default',
  text = '',
  className = '',
  hasTextLeft = false,
  input = {},
  value
}) {
  const classes = clsx('is-checkradio', 'is-medium', className)
  return (
    <div className="field radio-button">
      {hasTextLeft && text && (
        <label htmlFor={id}>
          <span className="radio-description pr-5">{text}</span>
        </label>
      )}
      <input
        className={classes}
        id={id}
        type="radio"
        {...input}
        value={value}
      />

      {!hasTextLeft && text && (
        <label htmlFor={id}>
          <span className="radio-description pl-5">{text}</span>
        </label>
      )}
    </div>
  )
}

export default RadioButton
