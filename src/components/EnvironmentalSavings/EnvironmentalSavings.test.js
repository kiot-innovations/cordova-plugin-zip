import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import EnvironmentalSavings from '.'
import * as i18n from '../../shared/i18n'

describe('Environmental Savings component', () => {
  it('renders without crashing', () => {
    let dispatchMock = jest.fn()
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)

    const component = shallow(
      <EnvironmentalSavings
        co2={{
          value: 3.2,
          units: 'ENV_SAVINGS_POUNDS'
        }}
        driven={200}
        coal={300}
        oil={2}
        gas={5}
        trees={20}
        garbage={17286}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
