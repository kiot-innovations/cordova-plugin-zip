import React, { useEffect } from 'react'
import moment from 'moment'
import bulmaCalendar from 'bulma-calendar/dist/js/bulma-calendar'

import './Calendar.scss'

const defaultOpts = {
  showHeader: false,
  displayMode: 'inline',
  showTodayButton: false,
  showClearButton: false,
  color: 'black'
}

const onSelect = handler => datepicker => handler(datepicker.data.value())

function Calendar({ onChange, value, options, right }) {
  const input = React.createRef()

  useEffect(() => {
    const customize = {
      ...defaultOpts,
      ...options,
      startDate: moment(value).toDate()
    }

    const calendar = bulmaCalendar.attach(input.current, customize)[0]
    calendar.on('select', onSelect(onChange))
  }, [input, onChange, options, right, value])

  const classes = `calendar${right ? ' right' : ''}`

  return (
    <div className={classes}>
      <input className="is-invisible" type="date" ref={input} />
    </div>
  )
}

export default Calendar
