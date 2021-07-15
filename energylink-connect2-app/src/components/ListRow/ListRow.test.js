import React from 'react'
import { shallow } from 'enzyme'
import ListRow from '.'
import * as i18n from 'shared/i18n'
import * as routing from 'shared/routing'

describe('ListRow component', () => {
  const download = jest.fn()

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    jest
      .spyOn(routing, 'createExternalLinkHandler')
      .mockImplementation(download)
  })

  test('renders correctly', () => {
    const component = shallow(<ListRow />)
    expect(component).toMatchSnapshot()
  })

  test.only('Runs the onCLick fn when pressing the row', () => {
    const component = shallow(<ListRow link="google.com" />)
    component.find('.row').simulate('click')
    expect(download).toBeCalled()
  })
})
