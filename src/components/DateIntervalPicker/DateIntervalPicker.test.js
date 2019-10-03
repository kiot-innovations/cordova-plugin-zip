import React from 'react'
import moment from 'moment'
import { shallow } from 'enzyme'
import { Chevron } from './Icons'
import * as i18n from '../../shared/i18n'
import { INTERVAL_DELTA } from '../../state/actions/history'
import DateIntervalScroller from '.'

describe('History View Date Scroller component', () => {
  let date

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    date = moment('2019-01-01T01:00:00.000Z')
  })

  it('Render a interval in day delta', () => {
    const interval = [moment(date).startOf('day'), moment(date).startOf('day')]
    const component = shallow(
      <DateIntervalScroller
        interval={interval}
        intervalDelta={INTERVAL_DELTA.DAY}
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('Render a interval in week delta', () => {
    const interval = [
      moment(date).startOf('week'),
      moment(date).startOf('week')
    ]
    const component = shallow(
      <DateIntervalScroller
        interval={interval}
        intervalDelta={INTERVAL_DELTA.WEEK}
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('Render a interval in month delta', () => {
    const interval = [
      moment(date).startOf('month'),
      moment(date).startOf('month')
    ]
    const component = shallow(
      <DateIntervalScroller
        interval={interval}
        intervalDelta={INTERVAL_DELTA.MONTH}
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('Render a interval in year delta', () => {
    const interval = [
      moment(date).startOf('year'),
      moment(date).startOf('year')
    ]
    const component = shallow(
      <DateIntervalScroller
        interval={interval}
        intervalDelta={INTERVAL_DELTA.YEAR}
      />
    )
    expect(component).toMatchSnapshot()
  })

  it('Changes to the previous range', () => {
    const interval = [
      moment(date).startOf('year'),
      moment(date).startOf('year')
    ]
    const onChangeSpy = jest.fn()
    const component = shallow(
      <DateIntervalScroller
        interval={interval}
        onChange={onChangeSpy}
        intervalDelta={INTERVAL_DELTA.YEAR}
      />
    )

    component
      .find(Chevron)
      .at(0)
      .simulate('click')

    date.subtract(1, 'years')
    const start = moment(date).startOf('year')
    const end = moment(date).endOf('year')
    expect(onChangeSpy).toBeCalledWith([start, end])
  })

  it('Changes to the next range', () => {
    const interval = [moment(date).startOf('day'), moment(date).startOf('day')]
    const onChangeSpy = jest.fn()
    const component = shallow(
      <DateIntervalScroller
        interval={interval}
        onChange={onChangeSpy}
        intervalDelta={INTERVAL_DELTA.DAY}
      />
    )

    component
      .find(Chevron)
      .at(1)
      .simulate('click')

    date.add(1, 'days')
    const start = moment(date).startOf('day')
    const end = moment(date).endOf('day')
    expect(onChangeSpy).toBeCalledWith([start, end])
  })

  it('Prevents selecting a date in the future', () => {
    const now = moment()
    const interval = [moment().startOf('day'), now]
    const onChangeSpy = jest.fn()
    const component = shallow(
      <DateIntervalScroller
        interval={interval}
        onChange={onChangeSpy}
        intervalDelta={INTERVAL_DELTA.DAY}
      />
    )

    component
      .find(Chevron)
      .at(1)
      .simulate('click')

    expect(onChangeSpy.mock.calls[0][0][0]).toEqual(interval[0])
    expect(onChangeSpy.mock.calls[0][0][1].format('MM/DD/YYYY')).toEqual(
      interval[1].format('MM/DD/YYYY')
    )
  })
})
