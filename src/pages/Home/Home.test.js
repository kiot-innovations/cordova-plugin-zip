import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import * as i18n from '../../shared/i18n'
import * as userActions from '../../state/actions/user'
import { INTERVALS } from '../../state/actions/energy-data'
import Home from '.'

describe('Home page', () => {
  const previousLocation = {
    pathname: '/'
  }
  let dispatchMock

  beforeEach(() => {
    const baseTime = new Date(2019, 8, 20)
    jest.spyOn(Date, 'now').mockImplementation(() => baseTime)

    dispatchMock = jest.fn()

    // add a div with #modal-root id to the global body
    // to enable portals testing
    const modalRoot = global.document.createElement('div')
    modalRoot.setAttribute('id', 'modal-root')
    const body = global.document.querySelector('body')
    body.appendChild(modalRoot)

    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(userActions, 'SELECT_ENERGY_GRAPH')
      .mockImplementation(id => `SELECT_ENERGY_GRAPH_${id}`)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => ({}))
    const component = shallow(<Home />)
    expect(component).toMatchSnapshot()
  })

  it('renders correctly when clicking on energy switch', () => {
    const { component } = mountWithProvider(
      <Home location={previousLocation} />
    )({
      global: { modal: {} },
      environment: { envImpact: {} },
      share: { dataUrl: '' },
      energyData: {
        [INTERVALS.HOUR]: {
          data: {
            '2019-09-19T15:00:00Z': {
              pp: 796.53,
              pc: 1101.6,
              ps: 0,
              p: 199.13,
              c: 275.4,
              s: 0,
              soc: 1,
              weather: 'clearsky'
            }
          }
        }
      }
    })
    component.find('.energy-switch .entries div:last-child').simulate('click')
    expect(dispatchMock).toBeCalledWith('SELECT_ENERGY_GRAPH_power')

    expect(component).toMatchSnapshot()
  })
})
