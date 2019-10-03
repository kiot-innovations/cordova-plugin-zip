import React from 'react'
import PeriodSelectorMenu from '.'
import * as reactRedux from 'react-redux'
import * as i18n from '../../shared/i18n'

const historyStore = {
  intervalDelta: 'DAY',
  interval: ['2020-09-02T05:00:00.000Z', '2021-01-01T05:59:59.999Z'],
  changingInterval: false
}

const options = [
  { id: 1, text: 'HISTORY_DAY_VIEW', value: 'DAY' },
  { id: 2, text: 'HISTORY_WEEK_VIEW', value: 'WEEK' },
  { id: 3, text: 'HISTORY_MONTH_VIEW', value: 'MONTH' },
  { id: 4, text: 'HISTORY_YEAR_VIEW', value: 'YEAR' },
  { id: 5, text: 'HISTORY_LIFETIME_VIEW', value: 'LIFETIME' },
  { id: 6, text: 'HISTORY_CUSTOM_DATES_VIEW', value: 'CUSTOM', disabled: true }
]

describe('Period Selector Menu component', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => ({
      history: historyStore
    }))
  })

  it('renders without crashing', () => {
    const modalRoot = global.document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')

    const body = global.document.querySelector('body')
    body.appendChild(modalRoot)

    const component = mountWithProvider(
      <PeriodSelectorMenu options={options} />
    )({})
    expect(component).toMatchSnapshot()
  })

  it('triggers open modal', () => {
    const modalRoot = global.document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')

    const body = global.document.querySelector('body')
    body.appendChild(modalRoot)

    const { component } = mountWithProvider(
      <PeriodSelectorMenu options={options} />
    )({})
    component
      .find('.chevronDown')
      .at(0)
      .simulate('click')
    expect(dispatchMock).toBeCalled()
  })

  it('triggers modal close on option selection', () => {
    const modalRoot = global.document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')

    const body = global.document.querySelector('body')
    body.appendChild(modalRoot)

    const { component } = mountWithProvider(
      <PeriodSelectorMenu options={options} />
    )({})
    component
      .find('.chevronDown')
      .at(0)
      .simulate('click')

    component
      .find('.date-option')
      .at(0)
      .simulate('click')
    expect(dispatchMock).toBeCalled()
  })
})
