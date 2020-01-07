import React from 'react'
import clsx from 'clsx'
import Select from 'react-select'

import './SelectField.scss'

const IndicatorSeparator = ({ innerProps }) => <span />

const selectComponents = { IndicatorSeparator }

function SelectField(props) {
  const {
    notFoundText,
    onSelect,
    className,
    autoFocus,
    options,
    defaultValue,
    placeholder
  } = props

  const classes = clsx('field', className)

  const defaults = {
    cacheOptions: true,
    placeholder,
    onChange: onSelect,
    className: classes,
    classNamePrefix: 'search',
    autoFocus,
    components: selectComponents,
    options,
    defaultValue,
    noOptionsMessage: () => notFoundText,
    theme: theme => ({
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
    })
  }

  return <Select {...defaults} />
}

export default SelectField
