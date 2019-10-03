import React from 'react'
import { shallow } from 'enzyme'
import ReferAFriend from '.'
import * as i18n from '../../shared/i18n'

describe('Refer A Friend component', () => {
  it('renders without crashing', () => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
    const component = shallow(<ReferAFriend />)
    expect(component).toMatchSnapshot()
  })
})
