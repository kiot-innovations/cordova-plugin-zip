import { shallow } from 'enzyme'
import React from 'react'

import { ChecklistRow } from '.'

import * as i18n from 'shared/i18n'

describe('ChecklistRow Component', () => {
  const row = { text: 'PRECOMM_HO_DETAILS', checked: false }
  const onCheck = jest.fn()

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly', () => {
    const component = shallow(<ChecklistRow row={row} check={onCheck} />)
    expect(component).toMatchSnapshot()
  })

  test('Runs the check fn when pressing the checkbox', () => {
    const component = shallow(<ChecklistRow row={row} check={onCheck} />)
    component
      .find('input[type="checkbox"]')
      .simulate('change', { target: { checked: true } })
    expect(onCheck).toHaveBeenCalled()
  })
})
