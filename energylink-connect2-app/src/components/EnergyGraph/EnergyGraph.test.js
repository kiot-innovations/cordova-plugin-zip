import React from 'react'
import * as reactRedux from 'react-redux'
import { shallow } from 'enzyme'
import * as i18n from '../../shared/i18n'
import EnergyGraph from '.'

describe('EnergyGraph component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )

    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => jest.fn)
  })

  it('renders without crashing', () => {
    const component = shallow(<EnergyGraph />)
    expect(component).toMatchSnapshot()
  })
})
