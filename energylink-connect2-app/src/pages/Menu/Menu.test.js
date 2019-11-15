import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import { shallow } from 'enzyme'
import Menu from '.'

describe('Menu Page', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()

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
