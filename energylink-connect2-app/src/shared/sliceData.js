import moment from 'moment'

export const sliceData = (data, startDate, endDate) => {
  const dateKeys = Object.keys(data)

  const startDateIx = dateKeys.findIndex(v => {
    return moment(v).isSameOrAfter(moment(startDate))
  })

  let endDateIx = dateKeys.reverse().findIndex(v => {
    return moment(v).isSameOrBefore(moment(endDate))
  })
  const isEndDateToday = moment().diff(moment(endDate), 'days') === 0

  if (endDateIx === -1) {
    if (isEndDateToday) {
      endDateIx = dateKeys.length - 1
    }
    endDateIx = 0
  } else {
    endDateIx = dateKeys.length - endDateIx
  }

  return {
    startDateIx,
    endDateIx,
    data: Object.fromEntries(Object.entries(data).slice(startDateIx, endDateIx))
  }
}
