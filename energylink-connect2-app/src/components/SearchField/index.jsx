import React from 'react'
import clsx from 'clsx'
import { components } from 'react-select'
import AsyncSelect from 'react-select/async'

import './SearchField.scss'

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <span className="sp sp-location" />
    </components.DropdownIndicator>
  )
}

const IndicatorSeparator = ({ innerProps }) => <span />

const Option = props => (
  <components.Option {...props}>
    <div className="is-flex file level">
      <p className="is-size-7">{props.label}</p>
      <span className="sp-location" />
    </div>
  </components.Option>
)

const selectComponents = { DropdownIndicator, IndicatorSeparator, Option }

function SelectField(props) {
  const { notFoundText, onSearch, onSelect, className, autoFocus } = props
  const classes = clsx('field', className)

  return (
    <AsyncSelect
      cacheOptions
      placeholder=""
      onChange={onSelect}
      loadOptions={onSearch}
      className={classes}
      classNamePrefix="search"
      autoFocus={autoFocus}
      components={selectComponents}
      noOptionsMessage={() => notFoundText}
      theme={theme => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary50: '#0a1421',
          primary25: '#0a1421',
          primary: 'transparent',
          neutral0: '#2f465b',
          neutral90: 'white',
          neutral70: 'white',
          neutral80: 'white'
        }
      })}
    />
  )
}

export default SelectField
