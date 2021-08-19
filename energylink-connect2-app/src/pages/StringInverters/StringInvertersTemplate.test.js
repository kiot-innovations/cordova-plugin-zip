import { shallow } from 'enzyme'
import React from 'react'
import * as reactRedux from 'react-redux'

import StringInvertersTemplate from './StringInvertersTemplate'

import * as i18n from 'shared/i18n'

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}))

describe('The StringInvertersTemplate', function() {
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

  it('should render correctly', function() {
    const component = shallow(<StringInvertersTemplate />)
    expect(component).toMatchSnapshot()
  })

  it('has a section called OTHER_DEVICES and has a children', function() {
    const component = shallow(
      <StringInvertersTemplate>
        <span>CHILDREN</span>
      </StringInvertersTemplate>
    )
    const span = component.find('.page-title')
    expect(span.exists()).toBe(true)
    expect(span.text()).toBe('OTHER_DEVICES')
    expect(component.containsMatchingElement(<span>CHILDREN</span>)).toBe(true)
  })
})
