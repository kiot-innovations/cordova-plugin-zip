import React, { useState } from 'react'
import ClickOutside from 'react-click-outside'
import moment from 'moment'
import Calendar from '../Calendar'
import ButtonSelect from '../ButtonSelect'
import { useI18n } from '../../shared/i18n'

import './CustomIntervalPicker.scss'

function CustomIntervalPicker(props) {
  const t = useI18n()
  const { onChange } = props
  const [right, setRight] = useState(false)
  const [show, setShow] = useState(false)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [options, setOptions] = useState({})

  const handleShow = (isRight = false) => () => {
    setRight(isRight)
    if (isRight) {
      setOptions({
        maxDate: moment().toDate(),
        minDate: startDate ? startDate.toDate() : null
      })
    } else {
      setOptions({
        maxDate: endDate ? endDate.toDate() : moment().toDate(),
        minDate: null
      })
    }

    setShow(true)
  }

  const handleClear = isRight => () => {
    if (isRight) {
      setEndDate()
    } else setStartDate()
    setOptions({})
    setShow(false)
  }

  const handleChange = isRight => value => {
    const date = moment(value, 'MM/DD/YYYY')
    if (date === startDate || date === endDate) {
      return
    }

    if (isRight) {
      setEndDate(date)
      onChange && onChange([startDate, date])
    } else {
      setStartDate(date)
      onChange && onChange([date, endDate])
    }
    setShow(false)
  }

  return (
    <div className="cusint">
      <div className="columns is-flex level">
        <ButtonSelect
          label={t('START_DATE')}
          onAction={handleShow()}
          onClear={handleClear()}
          value={startDate ? startDate.format('MM/DD/YYYY') : null}
        />
        <ButtonSelect
          label={t('END_DATE')}
          onAction={handleShow(true)}
          onClear={handleClear(true)}
          value={endDate ? endDate.format('MM/DD/YYYY') : null}
        />
      </div>
      {show && (
        <ClickOutside onClickOutside={() => setShow(false)}>
          <Calendar
            right={right}
            onChange={handleChange(right)}
            value={right ? endDate : startDate}
            options={options}
          />
        </ClickOutside>
      )}
    </div>
  )
}

export default CustomIntervalPicker
