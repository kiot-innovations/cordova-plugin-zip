import React from 'react'
import { shallow } from 'enzyme'
import PeriodSelector from '.'
import * as i18n from '../../shared/i18n'
import * as reactRedux from 'react-redux'
import * as historyActions from '../../state/actions/history'
import { changeDatePeriod } from '../../state/actions/history'

describe('History View Period Selector component', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => dispatchMock)
    jest.spyOn(historyActions, 'changeDatePeriod').mockImplementation(jest.fn)
  })

  it('renders without crashing', () => {
    const component = shallow(<PeriodSelector />)
    expect(component).toMatchSnapshot()
  })

  it('changes timeframe successfully', () => {
    const modalRoot = global.document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')

    const body = global.document.querySelector('body')
    body.appendChild(modalRoot)

    const { component } = mountWithProvider(<PeriodSelector />)({})
    component
      .find('.chevronDown')
      .at(0)
      .simulate('click')

    component
      .find('.date-option')
      .at(0)
      .simulate('click')
    expect(changeDatePeriod).toBeCalled()
  })
})
