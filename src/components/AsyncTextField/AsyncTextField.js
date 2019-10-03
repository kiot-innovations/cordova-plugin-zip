import React from 'react'
import clsx from 'clsx'
import './AsyncTextField.scss'

const AsyncTextField = ({
  input,
  meta,
  placeholder,
  loading,
  autoComplete = 'off',
  type = 'text'
}) => {
  const hasError =
    (meta.dirty || meta.touched) && (meta.error || meta.submitError)
  const classname = clsx('input', { error: hasError, 'is-loading': loading })
  return (
    <div className="async-text-field">
      <p className="control">
        <input
          {...input}
          className={classname}
          placeholder={placeholder}
          autoComplete={autoComplete}
          type={type}
        />
        {loading && (
          <progress className="progress is-small is-primary" max="100" />
        )}
        {hasError && (
          <span className="error">{meta.error || meta.submitError}</span>
        )}
      </p>
    </div>
  )
}

export default AsyncTextField
