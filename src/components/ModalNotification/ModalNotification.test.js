import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'
import * as reactRedux from 'react-redux'
import ModalNotification from '.'
import * as i18n from '../../shared/i18n'

describe('ModalNotification component', () => {
  let date
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    date = moment('2019-08-28', 'YYYY-MM-DD')
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
  })

  it('renders without crashing', () => {
    date = moment('2019-08-28', 'YYYY-MM-DD')
    const component = shallow(<ModalNotification date={date} />)
    expect(component).toMatchSnapshot()
  })

  it('renders a children if passed', () => {
    const component = shallow(
      <ModalNotification date={date}>
        <div>Children content!</div>
      </ModalNotification>
    )
    expect(component).toMatchSnapshot()
  })

  it('renders without a remove button', () => {
    const component = shallow(
      <ModalNotification date={date} removable={false} />
    )
    expect(component).toMatchSnapshot()
  })
})
