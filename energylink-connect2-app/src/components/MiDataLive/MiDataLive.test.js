import React from 'react'
import { shallow } from 'enzyme'
import MiDataLive from './index'
import * as i18n from 'shared/i18n'

describe('MiDataLive Component', () => {
  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  test('Renders Correctly when there is no data', () => {
    const data = []
    const expectedText = 'NO_MI_LIVE_DATA'
    const component = shallow(<MiDataLive data={data} />)
    expect(component.find('.mi-data-live p').exists()).toBe(true)
    expect(component.find('.mi-data-live p').text()).toBe(expectedText)
    expect(component).toMatchSnapshot()
  })

  test('Renders Correctly when there is data to show', () => {
    const data = [
      {
        sn: 'E00121837000376',
        power: 360
      },
      {
        sn: 'E00121836037707',
        power: 360
      }
    ]

    const component = shallow(<MiDataLive data={data} />)
    expect(component.find('.mi-data-live .power-production').exists()).toBe(
      true
    )
    expect(
      component.find('.mi-data-live .power-production .power-row').length
    ).toBe(2)
    expect(component).toMatchSnapshot()
  })
})
