import React from 'react'
import Switch from 'react-switch'
import './Toggler.scss'

function Toggler({ text, checked, onChange, ...togglerProps }) {
  return (
    <label className="toggler">
      <p>{text}</p>
      <Switch
        onChange={onChange}
        checked={checked}
        checkedIcon={null}
        uncheckedIcon={null}
        onColor="#EF8B22"
        {...togglerProps}
      />
    </label>
  )
}

export default Toggler
