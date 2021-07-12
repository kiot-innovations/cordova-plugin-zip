import clsx from 'clsx'
import React, { useState } from 'react'

function PasswordToggle({
  input,
  meta,
  placeholder,
  autoComplete = 'off',
  className = '',
  disabled = false
}) {
  const [type, setType] = useState('password')
  const [visibility, setVisibility] = useState('show')

  const toggleVisibility = () => {
    setType(type === 'input' ? 'password' : 'input')
    setVisibility(visibility === 'hide' ? 'show' : 'hide')
  }

  const inputClasses = clsx('input', className, {
    error: meta.touched && meta.error
  })

  return (
    <div className="field">
      <div className="control">
        <div className="password-container">
          <input
            {...input}
            type={type}
            className={inputClasses}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
          />
          <span className="toggle is-flex" onClick={toggleVisibility}>
            {visibility}
          </span>
        </div>
        {meta.touched && meta.error && (
          <span className="error">{meta.error}</span>
        )}
      </div>
    </div>
  )
}

export default PasswordToggle
