import React from 'react'
import Storage from '.'
import * as i18n from '../../shared/i18n'
import { INTERVALS } from '../../state/actions/energy-data'

describe('History page', () => {
  const previousLocation = {
    pathname: '/'
  }

  beforeEach(() => {
    jest
      .spyOn(i18n, 'useI18n')
      .mockImplementation(path => (key, ...params) =>
        `${key.toUpperCase()} ${params.join('_')}`.trim()
      )
  })

  it('renders without crashing', () => {
    const component = mountWithProvider(
      <Storage location={previousLocation} />
    )({
      storage: { selectedMode: 1 },
      energyData: {
        [INTERVALS.HOUR]: {
          data: {
            '2019-09-19T15:00:00Z': {
              pp: 796.53,
              pc: 1101.6,
              ps: 0,
              p: 199.13,
              c: 275.4,
              s: 0,
              soc: 1,
              weather: 'clearsky'
            }
          }
        }
      }
    })
    expect(component).toMatchSnapshot()
  })

  it('renders a different battery mode label when changing mode', () => {
    const component = mountWithProvider(
      <Storage location={previousLocation} />
    )({
      storage: { selectedMode: 2 },
      energyData: {
        [INTERVALS.HOUR]: {
          data: {
            '2019-09-19T15:00:00Z': {
              pp: 796.53,
              pc: 1101.6,
              ps: 0,
              p: 199.13,
              c: 275.4,
              s: 0,
              soc: 1,
              weather: 'clearsky'
            }
          }
        }
      }
    })
    expect(component).toMatchSnapshot()
  })
})
