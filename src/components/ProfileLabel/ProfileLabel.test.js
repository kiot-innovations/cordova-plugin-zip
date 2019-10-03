import React from 'react'
import { shallow } from 'enzyme'
import ProfileLabel from '.'
import * as i18n from '../../shared/i18n'

describe('Profile Label component', () => {
  it('renders without crashing', () => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    const component = shallow(<ProfileLabel />)
    expect(component).toMatchSnapshot()
  })
})
