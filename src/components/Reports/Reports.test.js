import React from 'react'
import { shallow } from 'enzyme'
import * as i18n from '../../shared/i18n'

import Reports from '.'

describe('Reports Component (from Profile page)', () => {
  beforeEach(() => {
    jest.spyOn(i18n, 'useI18n').mockImplementation(path => key => key)
  })

  it('renders without crashing', () => {
    const component = shallow(<Reports />)
    expect(component).toMatchSnapshot()
  })
})
