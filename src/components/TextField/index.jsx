import React from 'react'
import clsx from 'clsx'

const TextField = ({
  input,
  meta,
  placeholder,
  autoComplete = 'off',
  type = 'text',
  className = '',
  disabled = false
}) => {
  const hasError =
    (meta.dirty || meta.touched) && (meta.error || meta.submitError)
  const inputClasses = clsx('input', className, { error: hasError })
  return (
    <div className="field">
      <p className="control">
        <input
          {...input}
          type={type}
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

export default TextField
