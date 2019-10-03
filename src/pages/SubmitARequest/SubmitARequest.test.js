import React from 'react'
import { shallow } from 'enzyme'
import SubmitARequest from '.'
import * as i18n from '../../shared/i18n'

describe('SubmitARequest page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(<SubmitARequest />)
    expect(component).toMatchSnapshot()
  })
})
