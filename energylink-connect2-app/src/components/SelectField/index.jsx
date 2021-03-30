import React from 'react'
import clsx from 'clsx'
import Select, { components } from 'react-select'
import { either } from 'shared/utils'

import './SelectField.scss'

const IndicatorSeparator = ({ selectProps: { required } }) =>
  either(required, <span className="ml-20 pt-5 has-text-danger">*</span>)

const Option = props => {
  return (
    <components.Option {...props}>
      <div className="is-flex file level">
        <p className="is-size-6">{props.label}</p>
      </div>
    </components.Option>
  )
}

const selectComponents = { Option, IndicatorSeparator }

function SelectField(props) {
  const {
    notFoundText,
    onSelect,
    className,
    autoFocus,
    options,
    defaultValue,
    placeholder,
    isSearchable,
    value,
    disabled,
    required
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
    isSearchable,
    value,
    isDisabled: disabled,
    hideSelectedOptions: true,
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
        neutral80: 'white',
        neutral5: '#35404e'
      }
    }),
    required
  }

  return <Select {...defaults} />
}

export default SelectField
