import React from 'react'
import * as reactRedux from 'react-redux'
import * as i18n from 'shared/i18n'
import { shallow } from 'enzyme'
import SNList from '.'

describe('Serial Number List Page', () => {
  let dispatchMock

  let initialState = {
    serialNumbers: [
      {
        serial_number: 'E00121852014339',
        type: 'MI',
        model: 'Type E',
        bounding_box: {
          left: 504,
          top: 451,
          width: 1029,
          height: 86
        }
      },
      {
        serial_number: 'E00121852014348',
        type: 'MI',
        model: 'Type E',
        bounding_box: {
          left: 2655,
          top: 465,
          width: 1013,
          height: 75
        }
      },
      {
        serial_number: 'E00121929013075',
        type: 'MI',
        model: 'Type E',
        bounding_box: {
          left: 504,
          top: 848,
          width: 1009,
          height: 77
        }
      }
    ]
  }

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
    jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => initialState)
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('renders correctly', () => {
    const component = shallow(<SNList />)
    expect(component).toMatchSnapshot()
  })
})
