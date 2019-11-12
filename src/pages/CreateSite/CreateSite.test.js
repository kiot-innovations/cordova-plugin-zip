import React from 'react'
import { shallow } from 'enzyme'
import * as reactRedux from 'react-redux'
import CreateSite from '.'
import * as i18n from 'shared/i18n'

describe('CreateSite component', () => {
  let dispatchMock
  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = shallow(<CreateSite />)
    expect(component).toMatchSnapshot()
  })
})
