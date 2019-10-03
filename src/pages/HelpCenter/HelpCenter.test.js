import React from 'react'
import { shallow } from 'enzyme'
import HelpCenter from '.'
import * as i18n from '../../shared/i18n'

describe('HelpCenter page', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = shallow(<HelpCenter />)
    expect(component).toMatchSnapshot()
  })
})
