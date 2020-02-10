import React from 'react'
import clsx from 'clsx'
import './Textarea.scss'

const TextArea = ({
  input,
  meta,
  placeholder,
  autoComplete = 'off',
  className = '',
  disabled = false,
  light = false,
  textarea = true
}) => {
  const hasError =
    (meta.dirty || meta.touched) && (meta.error || meta.submitError)
  const inputClasses = clsx('input', className, {
    error: hasError,
    'input-light': light,
    textarea: textarea
  })
  return (
    <div className="field">
      <p className="control">
        <textarea
          {...input}
          className={inputClasses}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
        />
        {hasError && (
          <span className="error">{meta.error || meta.submitError}</span>
        )}
      </p>
    </div>
  )
}

export default TextArea
