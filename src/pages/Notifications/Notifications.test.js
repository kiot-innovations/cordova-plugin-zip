import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import * as i18n from '../../shared/i18n'
import Notifications from '.'

describe('Notifications page', () => {
  const alerts = {
    86772640: {
      AlertsID: 86772640,
      AlertTypeID: 2,
      AddressID: 11781,
      AlertStartTimeUTC: '2019-05-04T16:55:00.000Z'
    },
    86772642: {
      AlertsID: 86772642,
      AlertTypeID: 1,
      AddressID: 11781,
      AlertStartTimeUTC: '2017-05-04T16:55:00.000Z'
    },
    86772644: {
      AlertsID: 86772644,
      AlertTypeID: 4,
      AddressID: 11781,
      AlertStartTimeUTC: '2018-05-04T16:55:00.000Z'
    }
  }
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()

    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => alerts)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(<Notifications />)
    expect(component).toMatchSnapshot()
  })
})
