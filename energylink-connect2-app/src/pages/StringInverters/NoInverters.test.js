import { shallow } from 'enzyme'
import React from 'react'
import * as reactRedux from 'react-redux'

import NoInverters from 'pages/StringInverters/NoInverters'
import * as i18n from 'shared/i18n'

describe('No Inverters page', function() {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key = '', ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  describe('The NoInverters component', function() {
    it('should render correctly', function() {
      const component = shallow(<NoInverters />)
      expect(component).toMatchSnapshot()
    })

    it('has a button called RUN_DISCOVERY', function() {
      const component = shallow(<NoInverters />)
      const btn = component.find('button')
      expect(btn.exists()).toBe(true)
      expect(btn.text()).toBe('RUN_DISCOVERY')
    })
  })
})
