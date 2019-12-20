import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import * as ReactDOM from 'react-dom'
import { shallow } from 'enzyme'
import Menu from '.'

describe('Menu Page', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    ReactDOM.createPortal = jest.fn((element, node) => {
      return element
    })
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(jest.fn)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = shallow(<Menu />)
    expect(component).toMatchSnapshot()
  })
})
