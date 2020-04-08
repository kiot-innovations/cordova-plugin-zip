import React from 'react'
import { shallow } from 'enzyme'
import ModelEdit from '.'
import * as i18n from 'shared/i18n'
import * as reactRedux from 'react-redux'

describe('MI Model Editing page', () => {
  let dispatchMock

  const initialState = {
    serialNumbers: [
      {
        serial_number: 'E00121852014339',
        type: 'MI',
        miType: 'Type E',
        bounding_box: {
          left: 1174,
          top: 850,
          width: 1614,
          height: 131
        }
      },
      {
        serial_number: 'E00121929013075',
        type: 'MI',
        miType: 'Type E',
        bounding_box: {
          left: 1109,
          top: 1470,
          width: 1619,
          height: 113
        }
      },
      {
        serial_number: 'E00121852014321',
        type: 'MI',
        miType: 'Type E',
        bounding_box: {
          left: 1259,
          top: 2055,
          width: 1497,
          height: 113
        }
      },
      {
        serial_number: 'E00121852014325',
        type: 'MI',
        miType: 'Type E',
        bounding_box: {
          left: 1279,
          top: 2647,
          width: 1495,
          height: 105
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
    const component = shallow(<ModelEdit />)
    expect(component).toMatchSnapshot()
  })
})
