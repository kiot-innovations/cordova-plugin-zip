import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import SelectCostSaving from '.'
import * as i18n from '../../shared/i18n'

describe('SelectCostSaving component', () => {
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
    const component = shallow(<SelectCostSaving />)
    expect(component).toMatchSnapshot()
  })
})
