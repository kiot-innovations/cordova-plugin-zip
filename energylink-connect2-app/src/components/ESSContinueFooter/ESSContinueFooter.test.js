import { shallow } from 'enzyme'
import React from 'react'

import ContinueFooter from '.'

import * as i18n from 'shared/i18n'

describe('ESSContinueFooter Component', () => {
  const text = 'Test text'

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly with text', () => {
    const component = shallow(<ContinueFooter text={text} />)
    expect(component).toMatchSnapshot()
    expect(
      component
        .find('.is-size-6')
        .at(1)
        .exists()
    ).toBe(true)
  })

  test('Renders Correctly without text', () => {
    const component = shallow(<ContinueFooter />)
    expect(component).toMatchSnapshot()
    expect(
      component
        .find('.is-size-6')
        .at(1)
        .exists()
    ).toBe(false)
  })
})
