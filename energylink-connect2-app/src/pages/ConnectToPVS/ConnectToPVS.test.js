import React from 'react'
import { shallow } from 'enzyme'
import ConnectToPVS from '.'
import * as i18n from 'shared/i18n'
import * as reactRedux from 'react-redux'

describe('Connect to PVS page', () => {
  let dispatchMock

  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('render correctly', () => {
    const component = shallow(<ConnectToPVS />)
    expect(component).toMatchSnapshot()
  })
})
