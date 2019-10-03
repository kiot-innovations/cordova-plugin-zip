import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import SelectSolarSelfSupply from '.'
import * as i18n from '../../shared/i18n'

describe('SelectSolarSelfSupply component', () => {
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
      storage: {
        selectedCostSavingId: 1
      }
    }))
  })
  it('renders without crashing', () => {
    const component = shallow(<SelectSolarSelfSupply />)
    expect(component).toMatchSnapshot()
  })
})
