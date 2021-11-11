import { shallow } from 'enzyme'
import React from 'react'

import StatusBox from './index'

import * as i18n from 'shared/i18n'

describe('Connected Device Update Component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly', () => {
    const data = {
      text: 'ZT123456789',
      indicator: '50%',
      title: 'Production CT'
    }

    const component = shallow(
      <StatusBox
        title={data.title}
        text={data.text}
        indicator={data.indicator}
      />
    )
    expect(component).toMatchSnapshot()
  })
})
