import React from 'react'
import { shallow } from 'enzyme'
import ModalSelect from '.'
import * as reactRedux from 'react-redux'
import * as i18n from '../../shared/i18n'

describe('ModalSelect component', () => {
  let dispatchMock

  beforeEach(() => {
    dispatchMock = jest.fn()
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatchMock)
  })

  it('renders without crashing', () => {
    const component = shallow(<ModalSelect />)

    expect(component).toMatchSnapshot()
  })

  it('triggers open modal', () => {
    const component = shallow(<ModalSelect />)
    component.find('.modal-select').simulate('click')

    expect(dispatchMock).toBeCalled()
  })
})
