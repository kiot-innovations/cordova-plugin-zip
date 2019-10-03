import React from 'react'

import './ButtonSelect.scss'

function ButtonSelect(props) {
  const { label, value, onAction, onClear } = props

  return (
    <div className="stor tags has-addons">
      <button className="tag has-text-white is-size-6" onClick={onAction}>
        {value || label}
      </button>

      <button
        className="tag has-text-white is-size-6 has-text-primary"
        onClick={onClear}
        disabled={!value}
      >
        <span>&times;</span>
      </button>
      {props.children}
    </div>
  )
}

export default ButtonSelect
